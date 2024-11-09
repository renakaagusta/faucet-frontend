import { gql } from "graphql-request";

export const queryAddTokens = gql`{
    addTokens(orderDirection: desc, orderBy: blockTimestamp) {
        blockNumber
        blockTimestamp
        id
        token
        transactionHash
    }
}`

export const queryRequestTokens = gql`{
    requestTokens(orderDirection: desc, orderBy: blockTimestamp) {
        blockNumber
        blockTimestamp
        id
        requester
        token
        transactionHash
        receiver
    }
}`