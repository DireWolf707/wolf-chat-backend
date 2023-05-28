export { alias } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const arrayAgg = (table, nonNullableField) => sql`coalesce(json_agg(${table}) filter (where ${nonNullableField} is not null), '[]')`

export const arrayAggOrder = (table, orderByField, nonNullableField) =>
  sql`coalesce(json_agg(${table} order by ${orderByField} desc) filter (where ${nonNullableField} is not null), '[]')`

export const jsonAgg = (select) => {
  const chunks = []

  Object.entries(select).forEach(([key, column], index) => {
    if (index > 0) chunks.push(sql`,`)
    chunks.push(sql.raw(`'${key}',`), sql`${column}`)
  })

  return sql`
        coalesce(
          json_agg(json_build_object(${sql.fromList(chunks)})),
          '[]'
        )
      `
}

export const jsonAggWithOrder = (select, orderByField) => {
  const chunks = []

  Object.entries(select).forEach(([key, column], index) => {
    if (index > 0) chunks.push(sql`,`)
    chunks.push(sql.raw(`'${key}',`), sql`${column}`)
  })

  return sql`
        coalesce(
          json_agg(json_build_object(${sql.fromList(chunks)}) order by ${orderByField} desc),
          '[]'
        )
      `
}
