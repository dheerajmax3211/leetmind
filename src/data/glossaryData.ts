export const glossaryTerms = [
  // A
  { term: 'ACID Properties', definition: 'A set of properties of database transactions intended to guarantee validity even in the event of errors, power failures, etc. (Atomicity, Consistency, Isolation, Durability).' },
  { term: 'Active-Active', definition: 'A highly available architecture where traffic is distributed across multiple nodes, all of which are active and processing requests.' },
  { term: 'Active-Passive', definition: 'A highly available architecture where one node processes requests handles traffic, while a backup node remains on standby.' },
  { term: 'Agile', definition: 'A methodology in SDLC that promotes continuous iteration of development and testing throughout the software development lifecycle of the project.' },
  { term: 'Airflow', definition: 'Apache Airflow is an open-source workflow management platform for data engineering pipelines, allowing you to programmatically author, schedule, and monitor workflows.' },
  { term: 'Amazon API Gateway', definition: 'A fully managed AWS service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale.' },
  { term: 'Amortized Time', definition: 'The average time taken per operation, if you do many operations. Even if a single operation is slow (like resizing a dynamic array), the amortized time is O(1).' },
  { term: 'Apache Kafka', definition: 'A distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.' },
  { term: 'Asynchronous I/O', definition: 'A form of input/output processing that permits other processing to continue before the transmission has finished, heavily used in Node.js and scalable systems.' },
  { term: 'AWS EC2', definition: 'Elastic Compute Cloud. Secure and resizable compute capacity in the AWS cloud. Basically, virtual machines.' },
  { term: 'AWS S3', definition: 'Simple Storage Service. Object storage service offering industry-leading scalability, data availability, security, and performance.' },
  { term: 'AWS Lambda', definition: 'A serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers.' },

  // B
  { term: 'Backtracking', definition: 'An algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing solutions that fail constraints.' },
  { term: 'Base Availability', definition: 'In BASE (Basically Available, Soft state, Eventual consistency), ensuring the system seems to work all the time despite partial failures.' },
  { term: 'Batch Processing', definition: 'The processing of previously collected jobs in a single batch, commonly used in Spark or Hadoop for massive datasets.' },
  { term: 'BigQuery', definition: 'A fully managed, serverless enterprise data warehouse on GCP that enables scalable analysis over petabytes of data.' },
  { term: 'Bloom Filter', definition: 'A space-efficient probabilistic data structure that is used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not.' },
  { term: 'Blue-Green Deployment', definition: 'A deployment strategy that reduces downtime and risk by running two identical production environments (Blue and Green). Only one serves live traffic at a time.' },

  // C
  { term: 'CAP Theorem', definition: 'States that a distributed data store can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition tolerance.' },
  { term: 'Cassandra', definition: 'A free and open-source, distributed, wide-column store, NoSQL database management system designed to handle large amounts of data across many commodity servers.' },
  { term: 'CDN (Content Delivery Network)', definition: 'A geographically distributed network of proxy servers and their data centers, providing high availability and performance by distributing the service spatially relative to end users.' },
  { term: 'Celery', definition: 'An asynchronous task queue/job queue based on distributed message passing, commonly used in Python ecosystems.' },
  { term: 'CI/CD', definition: 'Continuous Integration / Continuous Deployment. The practice of automating the integration of code changes and the deployment of applications.' },
  { term: 'Cloud Run', definition: 'A managed compute platform by GCP that allows you to run containers that are invocable via requests or events.' },
  { term: 'Consistent Hashing', definition: 'A distributed hashing scheme that operates independently of the number of servers, ensuring only K/n keys need to be remapped when a node is added/removed.' },
  { term: 'CQRS', definition: 'Command Query Responsibility Segregation. An architectural pattern that separates reading data from writing data to scale them independently.' },

  // D
  { term: 'Data Lake', definition: 'A centralized repository that allows you to store all your structured and unstructured data at any scale.' },
  { term: 'Data Warehouse', definition: 'A central repository of integrated data from one or more disparate sources, used for reporting and data analysis.' },
  { term: 'Dead Letter Queue (DLQ)', definition: 'A service implementation to store messages that meet one or more failure conditions, like exceeding maximum retries.' },
  { term: 'Denormalization', definition: 'The process of improving the read performance of a database, at the expense of losing some write performance, by adding redundant copies of data.' },
  { term: 'Dialogflow', definition: 'Google Cloud\'s natural language understanding platform used to design and integrate a conversational user interface into mobile apps, web applications, devices, etc.' },
  { term: 'Distributed Lock', definition: 'A technique to ensure that multiple nodes in a distributed system do not execute the same code concurrently when mutating shared state. Often implemented via Redis or ZooKeeper.' },
  { term: 'Docker', definition: 'A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.' },
  { term: 'Dynamic Programming (DP)', definition: 'An optimization method that solves complex problems by breaking them down into simpler subproblems, storing results (memoization) to avoid redundant compute.' },

  // E
  { term: 'ELK Stack', definition: 'Elasticsearch, Logstash, and Kibana. A popular stack for centralized logging and log analysis.' },
  { term: 'ETL', definition: 'Extract, Transform, Load. Three database functions combined into one tool to pull data out of one database and place it into another.' },
  { term: 'Event-Driven Architecture', definition: 'A software architecture paradigm promoting the production, detection, consumption of, and reaction to events.' },
  { term: 'Eventual Consistency', definition: 'A consistency model used in distributed computing to achieve high availability that informally guarantees that, if no new updates are made to a given data item, eventually all accesses to that item will return the last updated value.' },
  
  // F
  { term: 'Fargate', definition: 'A serverless compute engine for containers that works with both Amazon ECS and EKS, removing the need to provision and manage servers.' },
  { term: 'Fault Tolerance', definition: 'The property that enables a system to continue operating properly in the event of the failure of some of its components.' },

  // G
  { term: 'GCP Pub/Sub', definition: 'An asynchronous and scalable messaging service by Google Cloud that decouples services producing events from services processing events.' },
  { term: 'GCP Spanner', definition: 'A fully managed, mission-critical, relational database service that offers transactional consistency at global scale.' },
  { term: 'Gossip Protocol', definition: 'A procedure or process of computer peer-to-peer communication that is based on the way epidemics spread to broadcast state to cluster nodes (e.g., used in Cassandra).' },
  { term: 'Graph Database', definition: 'A database that uses graph structures for semantic queries with nodes, edges, and properties to represent and store data (e.g., Neo4j).' },
  
  // H
  { term: 'High Availability (HA)', definition: 'A characteristic of a system which aims to ensure an agreed level of operational performance, usually uptime, for a higher than normal period.' },
  { term: 'Horizontal Scaling', definition: 'Scaling out by adding more machines to your pool of resources rather than scaling up existing machines.' },

  // I
  { term: 'Idempotency', definition: 'The property of certain operations that they can be applied multiple times without changing the result beyond the initial application. Crucial for robust API design (e.g. processing payments).' },
  { term: 'Index (Database)', definition: 'A data structure that improves the speed of data retrieval operations on a database table at the cost of additional writes and storage space (usually a B-Tree).' },
  { term: 'Inverted Index', definition: 'An index data structure storing a mapping from content, such as words or numbers, to its locations in a database file, or in a document or a set of documents. Used in search engines.' },

  // K
  { term: 'Kubernetes (K8s)', definition: 'An open-source container orchestration system for automating software deployment, scaling, and management.' },

  // L
  { term: 'Load Balancer', definition: 'A device or software that distributes network or application traffic across a number of servers to increase capacity and reliability (e.g., Nginx, AWS ALB).' },
  { term: 'Long Polling', definition: 'A variation of traditional polling where the server holds a client\'s connection open until new data is available or a timeout occurs, simulating push.' },

  // M
  { term: 'MapReduce', definition: 'A programming model and an associated implementation for processing and generating big data sets with a parallel, distributed algorithm on a cluster.' },
  { term: 'Master-Slave Replication', definition: 'A model where one device or process (master) controls one or more other devices or processes (slaves/replicas). Often used for database read scaling.' },
  { term: 'Memoization', definition: 'An optimization technique used primarily to speed up computer programs by storing the results of expensive function calls.' },
  { term: 'Message Queue', definition: 'A form of asynchronous service-to-service communication used in serverless and microservices architectures (e.g., RabbitMQ, SQS).' },
  { term: 'Microservices', definition: 'An architectural style that structures an application as a collection of loosely coupled, fine-grained services.' },

  // N
  { term: 'NoSQL', definition: 'A broad category of database management systems that do not use the traditional tabular relations of relational databases (e.g., MongoDB, Cassandra, DynamoDB).' },

  // O
  { term: 'OAuth 2.0', definition: 'The industry-standard protocol for authorization, allowing users to grant third-party applications access to their resources without sharing passwords.' },
  { term: 'Object Storage', definition: 'A computer data storage architecture that manages data as objects, as opposed to file systems or block storage (e.g., AWS S3).' },

  // P
  { term: 'Paging / Pagination', definition: 'The process of dividing a document or search results into discrete pages. Crucial for API performance on massive datasets.' },
  { term: 'Paxos / Raft', definition: 'Consensus algorithms used to achieve agreement on a single data value among distributed processes or systems. Used in ZooKeeper, etcd.' },
  { term: 'Polymorphism', definition: 'The provision of a single interface to entities of different types or the use of a single symbol to represent multiple different types in OOP.' },

  // R
  { term: 'Rate Limiting', definition: 'A strategy for limiting network traffic. It puts a cap on how often someone can repeat an action within a certain timeframe to prevent DDoS and abuse (e.g., Token Bucket algorithm).' },
  { term: 'Redis', definition: 'An open-source, in-memory data structure store, used as a database, cache, and message broker.' },
  { term: 'Recursion', definition: 'A method of solving a computational problem where the solution depends on solutions to smaller instances of the same problem.' },
  { term: 'REST', definition: 'Representational State Transfer. A software architectural style that guidelines create web services.' },
  { term: 'Reverse Proxy', definition: 'A type of proxy server that retrieves resources on behalf of a client from one or more servers, acting as an intermediary (e.g., HAProxy, Nginx).' },

  // S
  { term: 'Serverless', definition: 'A cloud computing execution model in which the cloud provider dynamically manages the allocation and provisioning of servers (e.g. AWS Lambda).' },
  { term: 'Sharding', definition: 'A type of database partitioning that separates very large databases into smaller, faster, more easily managed parts called data shards (horizontal partitioning).' },
  { term: 'Single Point of Failure (SPOF)', definition: 'A part of a system that, if it fails, will stop the entire system from working. System design aims to eliminate SPOFs.' },
  { term: 'Solid Principles', definition: 'Five design principles intended to make software designs more understandable, flexible and maintainable: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.' },
  { term: 'Snowflake ID', definition: 'A technique used in distributed systems to generate unique, k-sorted, 64-bit IDs without coordination (e.g. Twitter Snowflake).' },
  { term: 'System Design', definition: 'The process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.' },

  // T
  { term: 'Topological Sort', definition: 'A linear ordering of the vertices of a directed acyclic graph (DAG) such that for every directed edge uv, u comes before v. Used in dependency resolution.' },
  { term: 'Two-Phase Commit (2PC)', definition: 'A distributed algorithm that coordinates all the processes that participate in a distributed atomic transaction on whether to commit or abort.' },

  // V
  { term: 'Vertex AI', definition: 'A fully managed machine learning platform on Google Cloud that lets you train, evaluate, and deploy ML models and AI applications.' },
  { term: 'Vertical Scaling', definition: 'Scaling up by adding more power (CPU, RAM, DISK) to an existing machine.' },

  // W
  { term: 'WebSockets', definition: 'A computer communications protocol, providing full-duplex communication channels over a single TCP connection. Ideal for chat apps and real-time feeds.' },

  // Z
  { term: 'ZooKeeper', definition: 'An open-source server which enables highly reliable distributed coordination. Often used for leader election, configuration management, and distributed locks.' }
];
