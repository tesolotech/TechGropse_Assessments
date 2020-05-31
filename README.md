# TechGropse_Assessments

Q) When is it a good idea to not use NodeJs? Why?

-> There are some use cases where Node is not a good choice, they are explain below:-

A)HEAVY SERVER-SIDE COMPUTATION/PROCESSING:

Node.js was never created to solve the compute scaling problem.
Node.js is single-threaded and uses only a single CPU core.
When it comes to heavy computation, Node.js is not the best platform around.
any CPU intensive operation annuls all the throughput benefits Node offers with its event-driven, non-blocking I/O model because any incoming requests will be blocked while the thread is occupied with your number-crunching.
Node.js hasn't been built with the “solving the compute scaling” issue in mind.

B)SERVER-SIDE WEB APPLICATION WITH A RELATIONAL DATABASE BEHIND:

Relational DB tools for Node.js are still rather underdeveloped, compared to the competition.
As for example, Rails automagically provides data access setup right out of the box together with DB schema migrations support tools


