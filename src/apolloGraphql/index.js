import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import config from '../config';

export default class Graph {
  constructor() {
    this.apiUrl = `${config.url}/graphql`;
    this.apiWs = `${config.ws}/subscriptions`;
    let wsLink = new WebSocketLink({
      uri: this.apiWs,
      options: {
        reconnect: true,
        headers: {
          authorization: localStorage.getItem('jwt'),
        },
      },
    });

    let httpLink = new HttpLink({
      uri: this.apiUrl,
    });

    const middlewareLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: localStorage.getItem('jwt') || null,
        },
      });

      return forward(operation);
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

    this.client = new ApolloClient({
      link,
      cache,
    });
  }

  sendMutation(mutation) {
    return new Promise((resolve) => {
      this.client.mutate({ mutation })
        .then(data => resolve(data.data));
    });
  }

  sendQuery(query) {
    return new Promise((resolve) => {
      this.client.query({ query })
        .then(data => resolve(data.data));
    });
  }
}
