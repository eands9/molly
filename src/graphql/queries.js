/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCalEvent = /* GraphQL */ `
  query GetCalEvent($id: ID!) {
    getCalEvent(id: $id) {
      id
      name
      lname
      start
      end
      cycle_length
      duration
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listCalEvents = /* GraphQL */ `
  query ListCalEvents(
    $filter: ModelcalEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        lname
        start
        end
        cycle_length
        duration
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
