# EC2/VPC Networking

- Management or isolated networks
- Software Liscening (MAC)

## SR-IOV

Enhanced networking uses single root I/O virtualization (SR-IOV) to provide high-performance networking capabilities on supported instance types.

SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to traditional virtualized network interfaces.

Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies.

## Elastic Fabric Adapter (EFA)

- A type of networking interface for EC2
- ... 1 per instance
- ... added at launch or when shutdown
- Supports "OS Bypass" improving performance
- HPC or ML applications
- ... which use MPI or NCCL

- OS Bypass is single subnet only
- cross subnet/AZ works for normal IP traffic
- OS Bypass traffic can't be routed
- Security Group needs an ALLOW ALL, Self-Referential rule INBOUND and OUTBOUND

## EC2 Placement Groups

When you launch a new EC2 instance, the EC2 service attempts to place the instance in such a way that all of your instances are spread out across underlying hardware to minimize correlated failures.
You can use placement groups to influence the placement of a group of interdependent instances to meet the needs of your workload.

### Cluster

Packs instances close together inside an Availability Zone. This strategy enables workloads to achieve the low-latency network performance necessary for tightly-coupled node-to-node communication that is typical of HPC applications.

- Can't span AZs. ONE AZ ONLY - locked when launching first instance
- Can span VPC peers - but impacts performance
- Requires a supported instance type
- Use the same type of instance (not mandatory)
- Launch at the same time (not mandatory... very recommended)
- 10Gbps single stream performance
- Use cases: Performance, fast speeds, low latency (ie, scientific analysis)

### Partition

spreads your instances across logical partitions such that groups of instances in one partition do not share the underlying hardware with groups of instances in different partitions.

This strategy is typically used by large distributed and replicated workloads, such as Hadoop, Cassandra, and Kafka.

- Limited to 7 instances per AZ - Isolated infrastructure limit
- Provides infrastructure isolation
- ...each instance runs from a different rack
- Each rack has its own network and power source
- Not supported for Dedicated Instances or Hosts
- Use Case: Small number of critical instances that need to be kept separated from each other
- Great for topology aware applications (ie, HDFS, HBase, and Cassandra)
- Contain the impact of failure to part of the application

### Spread

strictly places a small group of instances across distinct underlying hardware to reduce correlated failures.

For this course ... the "Cluster" placement group is the most relevant because it allows the highest levels of network performance to be achieved.

## Instance Metadata

- EC2 Service provides data to Instances
- Accesible inside ALL instances
- http://169.254.169.254/latest/meta-data
- Environment
- Networking
- Authentication
- User-Data
- NOT AUTHENTICATED or ENCRYPTED
