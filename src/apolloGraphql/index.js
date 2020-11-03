import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

import config from '../config';

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('jwt') || null,
    },
  });

  return forward(operation);
});

let httpLink = createUploadLink({
  uri:  `${config.url}/graphql`
});


let wsLink = new WebSocketLink({
  uri: `${config.ws}/subscriptions`,
  options: {
    reconnect: true,
    headers: {
      authorization: localStorage.getItem('jwt'),
    },
  },
});

httpLink = middlewareLink.concat(httpLink);
wsLink = middlewareLink.concat(wsLink);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  // eslint-disable-next-line
  dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}` : null),
  addTypename: false,
});

cache.writeData({ data: { headerTabId: 0 } }); // initial values of the cache

export const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
});

export const updateCache = (
  apolloCache,
  mutationResult,
  query,
  itemsName,
  mutationName,
  isExistingItem = false,
  matchField = 'key',
) => {
  const items = apolloCache.readQuery({
    query,
  })[itemsName];

  // set the new item
  let updatedItems = items.concat([mutationResult.data[mutationName]]);

  // update the existing item
  if (isExistingItem) {
    items.forEach((item, i) => {
      if (item[matchField] === mutationResult.data[mutationName][matchField]) {
        items[i] = mutationResult.data[mutationName];
      }
    });

    updatedItems = items;
  }

  // update the Apollo cache
  apolloCache.writeQuery({
    query,
    data: {
      [itemsName]: updatedItems,
    },
  });
};
