/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCalEvent = /* GraphQL */ `
  mutation CreateCalEvent(
    $input: CreateCalEventInput!
    $condition: ModelcalEventConditionInput
  ) {
    createCalEvent(input: $input, condition: $condition) {
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
export const updateCalEvent = /* GraphQL */ `
  mutation UpdateCalEvent(
    $input: UpdateCalEventInput!
    $condition: ModelcalEventConditionInput
  ) {
    updateCalEvent(input: $input, condition: $condition) {
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
export const deleteCalEvent = /* GraphQL */ `
  mutation DeleteCalEvent(
    $input: DeleteCalEventInput!
    $condition: ModelcalEventConditionInput
  ) {
    deleteCalEvent(input: $input, condition: $condition) {
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
