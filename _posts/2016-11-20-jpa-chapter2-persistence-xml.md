---
layout: post
title: JPA - 2장 - 설정 파일 및 Database 방언
categories: [jpa, java, hibernate]
comments: true
image:
---

> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

### persistence.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence" version="2.1">
    <persistence-unit name="testdb">
        <properties>
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>

            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect" />
            <property name="hibernate.show_sql" value="true" />
            <property name="hibernate.format_sql" value="true" />
            <property name="hibernate.use_sql_comments" value="true" />
            <property name="hibernate.id.new_generator_mappings" value="true" />
            <!--<property name="hibernate.hbm2ddl.auto" value="create" />-->
        </properties>
    </persistence-unit>
</persistence>
{% endhighlight %}

일반적인 persistence.xml은 위와 같은 구조(hibernate기준)를 가지고 있다.

제일 위에 아래와 같은 xml namespace 에대한 정의를 포함하는 persistence 테그로 시작한다. version="2.1"은 JPA 2.1 버전을 사용한다는 의미이다.
{% highlight xml %}
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence" version="2.1">
{% endhighlight %}

persistence-unit 는 일반적으로 연결할 Database하나당 하나씩 생성한다고 보면 된다. 아래는 unit의 이름을 testdb로 설정 했다.
{% highlight xml %}
<persistence-unit name="testdb">
{% endhighlight %}

그리고 일반적인 JDBC접속 정보를 설정 한다. 어떤 Database이건 어떤 JPA 구현체든지 이부분은 설정해 줘야 한다. javax.persistance로 시작하는 property는 JPA 공통 설정이다.
{% highlight xml %}
<property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
<property name="javax.persistence.jdbc.user" value="sa"/>
<property name="javax.persistence.jdbc.password" value=""/>
<property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
{% endhighlight %}

그 다음에 나오는 설정은 Database방언에 대한 설정인데, 이부분은 아래에서 좀더 자세하게 설명한다.
{% highlight xml %}
<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect" />
{% endhighlight %}

그리고 그 아래의 설정들은 hibernate에 종속된 몇가지 옵션들이 이부분은 꼭 필요한 부분은 아니다.

### Database 방언(Dialect)
방언이란 서로 다른 Database간의 SQL문법 차이를 말하며 JPA 구현체들은 이를 보정해 주기 위해 Dialect Class를 제공한다 이를 통해서 Database가 변경되어도 Dialect Class교체 만으로 코드 변경없이 문제를 해결 할 수 있게 된다.

Hibernate 의 Dialect 리스트는 아래 와 같다.
<!--more-->

| Name | 설명 |
|:-----|:----|
|Cache71Dialect|Caché 2007.1 dialect.|
|DataDirectOracle9Dialect| 	 |
|DB2390Dialect| 	An SQL dialect for DB2/390.|
|DB2400Dialect| 	An SQL dialect for DB2/400.|
|DB2Dialect| 	An SQL dialect for DB2.|
|DerbyDialect| 	Hibernate Dialect for Cloudscape 10 - aka Derby.|
|Dialect| 	Represents a dialect of SQL implemented by a particular RDBMS.|
|FirebirdDialect| 	An SQL dialect for Firebird.|
|FrontBaseDialect| 	An SQL Dialect for Frontbase.|
|H2Dialect| 	A dialect compatible with the H2 database.|
|HSQLDialect |	An SQL dialect compatible with HSQLDB (HyperSQL). HSQLDialect.ReadUncommittedLockingStrategy 	 |
|InformixDialect |	Informix dialect. Seems to work with Informix Dynamic Server Version 7.31.UD3, Informix JDBC driver version 2.21JC3.|
|Ingres10Dialect |	A SQL dialect for Ingres 10 and later versions.|
|Ingres9Dialect |	A SQL dialect for Ingres 9.3 and later versions.|
|IngresDialect |	An SQL dialect for Ingres 9.2.|
|InterbaseDialect |	An SQL dialect for Interbase.|
|JDataStoreDialect |	A Dialect for JDataStore.|
|MckoiDialect |	An SQL dialect compatible with McKoi SQL.|
|MimerSQLDialect |	An Hibernate 3 SQL dialect for Mimer SQL.|
|MySQL5Dialect |	An SQL dialect for MySQL 5.x specific features.|
|MySQL5InnoDBDialect MySQLDialect |	An SQL dialect for MySQL (prior to 5.x).|
|MySQLInnoDBDialect |	 |
|MySQLMyISAMDialect |	 |
|Oracle10gDialect |	A dialect specifically for use with Oracle 10g.|
|Oracle8iDialect |	A dialect for Oracle 8i.|
|Oracle9Dialect |	Deprecated. Use either Oracle9iDialect or Oracle10gDialect instead|
|Oracle9iDialect |	A dialect for Oracle 9i databases.|
|OracleDialect |	Deprecated. Use Oracle8iDialect instead.|
|PointbaseDialect |	A Dialect for Pointbase.|
|PostgresPlusDialect |	An SQL dialect for Postgres Plus|
|PostgreSQLDialect |	An SQL dialect for Postgres For discussion of BLOB "support" in postrges, as of 8.4, have a peek at http://jdbc.postgresql.org/documentation/84/binary-data.html. |
|ProgressDialect |	An SQL dialect compatible with Progress 9.1C Connection Parameters required: hibernate.dialect org.hibernate.sql.ProgressDialect hibernate.driver com.progress.sql.jdbc.JdbcProgressDriver hibernate.url jdbc:JdbcProgress:T:host:port:dbname;WorkArounds=536870912 hibernate.username username hibernate.password password The WorkArounds parameter in the URL is required to avoid an error in the Progress 9.1C JDBC driver related to PreparedStatements. |
|RDMSOS2200Dialect |	This is the Hibernate dialect for the Unisys 2200 Relational Database (RDMS). |
|ResultColumnReferenceStrategy |	Defines how we need to reference columns in the group-by, having, and order-by clauses. |
|SAPDBDialect |	An SQL dialect compatible with SAP DB. |
|SQLServer2008Dialect |	A dialect for Microsoft SQL Server 2008 with JDBC Driver 3.0 and above |
|SQLServerDialect |	A dialect for Microsoft SQL Server 2000 and 2005 |
|Sybase11Dialect |	A SQL dialect suitable for use with Sybase 11.9.2 (specifically: avoids ANSI JOIN syntax) |
|SybaseAnywhereDialect |	SQL Dialect for Sybase Anywhere extending Sybase (Enterprise) Dialect (Tested on ASA 8.x) |
|SybaseASE15Dialect |	An SQL dialect targetting Sybase Adaptive Server Enterprise (ASE) 15 and higher. |
|SybaseDialect |	Deprecated. use AbstractTransactSQLDialect, SybaseASE15Dialect or SQLServerDialect instead depending on need. |
|TeradataDialect |	A dialect for the Teradata database created by MCR as part of the dialect certification process. |
|TimesTenDialect |	A SQL dialect for TimesTen 5.1. |
