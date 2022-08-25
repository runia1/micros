import { gql } from "@apollo/client";

export const GET_SCHEDULE_RESOURCES = gql`
    query {
        getScheduleResources {
            Aircraft {
                id
                make
                model
                nNumber
                imageUrl
                primaryLocation {
                    id
                    name
                    city
                    state
                }
            }
            Students {
                id
                firstName
                lastName
            }
            Instructors {
                id
                firstName
                lastName
            }
        }
    }
`;
