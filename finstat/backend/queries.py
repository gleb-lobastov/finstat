from itertools import zip_longest
from django.db import connection

COL_NAME = 0


def _run_query(query_string, *query_args):
    cursor = connection.cursor()
    cursor.execute(query_string, query_args)
    col_names = tuple(description[COL_NAME] for description in cursor.description)

    result = []
    row = cursor.fetchone()
    while row:
        result.append(dict(zip_longest(col_names, row)))
        row = cursor.fetchone()

    return result


def accumulations(account_ids):
    account_ids = list(map(int, account_ids))

    amount_accumulation = """
        SUM (A{id}) OVER (ORDER BY date) "{id}"
    """
    spread_amount_by_accounts = """
        SUM(
            CASE WHEN fk_account_to_id = {id} THEN amount ELSE 0 END -
            CASE WHEN fk_account_from_id = {id} THEN amount ELSE 0 END
        ) A{id}
    """
    query = """
        SELECT date, {accumulations}
        FROM (
          SELECT date, {amounts}
          FROM
            finstat_transaction
          WHERE
            fk_account_from_id IN ({ids}) OR
            fk_account_to_id IN ({ids})
          GROUP BY date
        ) AS tAccounting
        ORDER BY date DESC
    """

    accounts = ', '.join(map(str, account_ids))
    accumulations = ', '.join(amount_accumulation.format(id=account_id) for account_id in account_ids)
    spread = ', '.join(spread_amount_by_accounts.format(id=account_id) for account_id in account_ids)

    cursor = connection.cursor()
    cursor.execute(query.format(accumulations=accumulations, amounts=spread, ids=accounts))
    return [{'date': row[0], 'spread': row[1:]} for row in cursor.fetchall()]
