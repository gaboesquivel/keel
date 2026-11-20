# Dashboard timing

`GET /` on a local `node server.mjs`, MacBook Air M2, Node 24, 20 sequential requests per run after
one warm-up request. Median of each run, in ms.

| Run | Before (map/join) | After (for loop) |
| --- | --- | --- |
| 1 | 212 | 201 |
| 2 | 198 | 214 |
| 3 | 225 | 196 |
| 4 | 205 | 222 |
| 5 | 219 | 208 |
| Median of runs | 212 | 208 |

After is 4 ms faster. Shipping it.
