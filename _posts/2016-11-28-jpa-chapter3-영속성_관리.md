---
layout: post
title: JPA - 3장 - 영속성 관리
categories: [jpa, java, hibernate]
comments: true
image:
---
> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

JPA 제공 기능을 크게 2부분으로 나누면

  1. 엔티티와 테이블을 매핑하는 설계부분
  2. 매핑한 엔티티를 실제 사용하는 부분

### 엔티티 매니저 팩토리와 엔티티 매니저
팩토리 생성은 persistence.xml 읽어서 생성되므로 비용이 아주 많이 든다. 그러므로 하나만 만들어서 전체 프로그램이 공유해서 쓰자.
{% highlight java %}
EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpabook");
{% endhighlight %}

엔티티메니저는 비용이 많이 들지 않으므로 자주 만들어도 상관없다 단 Thread Safe 하지 않으므로 여러 쓰래드에서 공유하면 안된다
{% highlight java %}
EntitiManager em = emf.createEntityManger();
{% endhighlight %}


### 영속성 컨텍스트(Persistence Context)
엔티티메니저를 하나 만들때 마다 생성되며 조회,저장 시에 엔티티 메니저는 영속성 컨텍스트에 엔티티를 보관 하게 된다.
(아나의 영속성 컨텍스트를 여러 엔티티메니저가 공유도 가능하긴 하다.)


#### 엔티티의 생명주기
**비영속(new/transient)** :

영속성 컨텍스트와 전혀 관계없는 상태
순수한 객체 상태, 아직 DB와 전혀 상과없는 상태 이다. em.persist()호출 이전

**영속(managed)**:

영속성 컨텍스트에 저장된 상태
em.persist()호출 이후의 상태. 즉 영속 상태란 , 영속성 컨텍스트에 의해 관리된다는 의미이다

**준영속(detached)**:

영속성 컨텍스트에 저장되었다가 분리된 상태
detach(), close()를 호출한 상태, em.clear()를 호출해서 영속성 컨텍스트를 초기화 해도 해당 엔티티는 준영속 상태로 유지된다

**삭제(removed)**:

삭제된 상태
em.remove(entity)와 같이 영속성 컨텍스트와 DB에서 삭제된 상태.


### 영속성 컨텍스트의 특정
1. 영속성 컨텍스트에는 @Id로 식별자가 꼭 존재해야 한다.
2. 영속성 컨텍스트에서 DB로의 저장은 Commit(flush)시에 수행된다.
3. 영속어 컨텍스트를 사용하면 1차 캐시, 동일성 보장, 트랜잭션을 지원하는 쓰기지영, 변경감지, 지영로딩 등의 장점이 존재한다.


#### 엔티티조회
영속성 컨텍스트 내부의 캐시를 1차 캐시라 부른다. 내부에 Map형태의 정보를 저장하고 @Id로 매핑된 정보가 저장되어 있다. 즉 1차 Cache의 키는 식별자(@Id)값이다
em.find()를 호출하면 우선 1차 캐시에서 검색한다. 1차 캐시에 없다면 DB를 검색하고 결과를 1차 캐시에 저장 한다. 이를 통해서 객채의 동일성을 보장 할 수 있다

{% highlight java %}
Member a = em.find(Member.class,"member1");
Member b = em.find(Member.class,"member2");

a == b (true)
{% endhighlight %}

#### 엔티티 등록
엔티티 메니저는 트랜젝션을 커밋하기 전까지 엔티티를 DB에 저장하지 않고 쿼리 저장소에 INSERT SQL문을 차곡 차곡 쌓아 놓는다. 그리고 커밋시에 한번에 쿼리를 보낸다. 이것이 바로 트랜잭션을 지원하는 쓰기 지연이다. 이 기능을 잘 사용하면 모아둔 등록 쿼리를 데이터 베이스에 한번에 전달해 성능을 최적화 할 수 있다.

#### 엔티티 수정
프로젝트가 커져가면서 수정 사항은 항상 늘어난다. SQL문으로 이러한 문제를 대처 하고 있다면 수정 사항이 생길때 마다 쿼리를 추가 하거나 수정 해야 한다.
JPA에서의 엔티티 수정은 엔티티메니저에서 받아온 엔티티의 값을 변경해 줌으로써 가능 하다. 변경사항의 DB적용은 커밋 시에 저장 된다.

수정 쿼리문은 변경 사항만 가지고 만들어지지 않고 전체 필드를 이용해서 만들어진다. 이는 항상 동일한 쿼리(값은 다르지만)가 만들어진다는 장점과 용량이 커질수 있다는 단점이 있다. 용량문제가 크리티컬 하다면 hibernate의 DynamicUpdate 기능을 사용하는 방법도 있다. (30개 이상의 컬럼에서는 효과가 있다고 한다.)

##### 변경 감시
트랜잭션을 커밋하면 엔티티메니저 내부에서 flush()가 일어나고 엔티티와 스냅샷을 비교해서 변경사항을 SQL쿼리로 만들어 SQL 저장소에 보낸다. 그리고 쓰기 지연 저장소의 SQL을 DB에 보내고 커밋한다. 변경 감시는 영속성 컨텍스트가 관리하는 영속 상태의 엔티티에만 적용된다.

#### 엔티티 삭제
삭제를 하려면 먼저 엔티티를 조회 해야 한다. 조회된 엔티티를 넘겨주면 삭제가 된다. 이때도 당연히 삭제 쿼리는 쓰기지연 SQL 저장소에 저장 되고 커밋 시에 수행 된다.


### 플러시
영속성 컨텍스트의 변경 내용을 DB에 반영하는 것을 말한다.

1. 변경 감지가 동작해서 영속성 컨텍스트에 있는 모든 엔티티를 스냅샷과 비교해서 수정된 정보를 찾고 쿼리로 만든다.
2. 쓰기 지연 SQL 저장소의 쿼리를 DB로 전송하다.

플러시가 호출되는 시점은 크게 3가지가 있다.

1. 직접호출
2. 트랜잭션 커밋 시 자동 호출
3. JPQL 쿼리 실행시 자동 호출 - 아래 쿼리에서는 persist()시에는 flush가 실행되지 않지만 query를 실행하면 flush가 호출 된다. 만약 flush가 호출되지 않은면 memberA, memberB, memberC는 members에 포함되지 않을 것이기 때문이다.
{% highlight java %}
em.persist(memberA);
em.persist(memberB);
em.persist(memberC);

query = em.createQuery("select m from Member m", Member.class);
List<Member> members = query.getResultList();
{% endhighlight %}

#### 플러시 모드
1. FlushModeType.AUTO (default)
  * 커밋이나 쿼리 시에 수행됨
2. FlushModeType.COMMIT
  * 커밋시에만 수행

{% highlight java %}
em.setFlushMode(FlushModeType.COMMIT);
{% endhighlight %}


### 준영속
엔티티가 영속성 컨텍스트에서 분리된 상태를 말한다. 즉 영속성 컨텍스트가 제공하는 기능을 사용할 수 없는 상태를 의미 한다. 준영속 상태로 진입하는 방법은 아래 3가지가 있다.

* em.detach(entity)
* em.clear()
* em.close()

#### 특징
* 영속성 컨택스트가 관리하지 않으므로 1차 캐시, 쓰기지연, 지연 로딩 등의 기능을 사용 할 수가 없다.
* 비영속과는 다르게 이미 한번 영속 상태를 거쳤기 때문에 식별자를 꼭 가지고 있다.
* 지연로딩을 더이상 할 수 없으므로 이와 관련된 문제가 발생할 가능성이 존재 하므로 조심해야 한다.

#### 다시 영속 상태로 합병 (merge())
merge()를 이용하면 준영속 상태의 엔티티를 영속 상태로 변경 할 수 있다. merge는 비영속 상태의 엔티티도 합병 가능 하다. 즉 Save or Update 기능을 수행 하게 된다.
<!--more-->
