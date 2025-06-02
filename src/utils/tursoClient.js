import { createClient } from "@libsql/client";

export const tursoGlobalClient = createClient({
    url: "libsql://definitions-penofender.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJnaWQiOiJhYzRjNGYwNC01OWY3LTRmMzEtOWRlNy1iNTJlZTcwNGY0ZDYiLCJpYXQiOjE3NDg4MzY2MzgsInJpZCI6Ijk0NTA1NjkzLWU2ZGEtNDc3Ni1hNGNhLTZhZDA5ZGY0MjMxMyJ9.lO-VajT6kYIxXhSU11H8_rwhx-V5fORMZlP51zG2Z4Q8JQj6k0UXBj4k9baePK0mdQAtvp145EVLbKYAroc9DA",
})

export default tursoGlobalClient;