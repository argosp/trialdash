import { Query } from 'react-apollo';
import React from 'react';
import ContentTable from '../ContentTable';

const TableContentContainer = ({
  query,
  queryArgs,
  tableHeadColumns,
  // subscription,
  renderRow,
  dataType,
  // subscriptionUpdateField,
}) => (
  <>
    <Query query={query(...queryArgs)}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p> No data to show</p>;
        return (
          <ContentTable headerColumns={tableHeadColumns} refetchData={refetch}>
            {data[dataType].map(renderRow)}
          </ContentTable>
        );
      }}
    </Query>
    {/*    <Subscription subscription={subscription}>
        {({ data, loading }) => {
          if (data && data[subscriptionUpdateField]) {
            queryRefetch !== null && queryRefetch();
          }
          return null;
        }}
      </Subscription> */}
  </>
);

export default TableContentContainer;
