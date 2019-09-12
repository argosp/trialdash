import { Query, Subscription } from 'react-apollo';
import React from 'react';
import ContentTable from '../ContentTable';
import ContentHeader from '../ContentHeader';

const TableContentContainer = ({
  headerTitle,
  searchPlaceholder,
  addButtonText,
  query,
  experimentId,
  tableHeadColumns,
  subscription,
  renderRow,
  dataType,
  subscriptionUpdateField,
}) => {
  let queryRefetch = null;

  return (
    <>
      <ContentHeader
        title={headerTitle}
        searchPlaceholder={searchPlaceholder}
        addButtonText={addButtonText}
      />
      <Query query={query(experimentId)}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p> No data to show</p>;
          queryRefetch = refetch;
          return (
            <ContentTable headerColumns={tableHeadColumns}>
              {data[dataType].map(renderRow)}
            </ContentTable>
          );
        }}
      </Query>
      <Subscription subscription={subscription}>
        {({ data, loading }) => {
          if (data && data[subscriptionUpdateField]) {
            queryRefetch !== null && queryRefetch();
          }
          return null;
        }}
      </Subscription>
    </>
  );
};

export default TableContentContainer;
