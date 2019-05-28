import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import config from './../config';

export default class Graph {
    constructor() {
        this.apiUrl = `${config.url}/graphql`;
        this.apiWs = `${config.ws}/subscriptions`
        const fragmentMatcher = new IntrospectionFragmentMatcher({
            introspectionQueryResultData: {
                __schema: {
                    types: []
                }
            }
        });
        let wsLink = new WebSocketLink({
            uri: this.apiWs,
            options: {
              reconnect: true,
              headers:{
                authorization:localStorage.getItem('jwt')
              }
            }
          });
        let httpLink = new HttpLink({
            uri: this.apiUrl,
            });
        const middlewareLink = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                authorization: localStorage.getItem("jwt") || null
                }
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
            )
        const cache = new InMemoryCache({ fragmentMatcher });
        this.client = new ApolloClient({
            link,
            cache,
        });
    }

    sendMutation(mutation) {
        return new Promise((resolve, reject) => {
            this.client.mutate({ mutation })
            .then(data => resolve(data.data))
        })
    }

    sendQuery(query) {
        return new Promise((resolve, reject) => {
            this.client.query({ query })
            .then(data => resolve(data.data))
        })
    }

}