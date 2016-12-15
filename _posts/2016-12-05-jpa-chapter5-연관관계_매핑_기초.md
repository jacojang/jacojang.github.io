---
layout: post
title: JPA - 5장 - 연관관계 매핑 기초
categories: [jpa, java, hibernate]
comments: true
image:
---
> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

### 단방향 연관관계
연관관계중에서는 다대일(N:1)을 가정 먼저 이해 하고 넘어가야 한다. 회원과 팀의 관계가 그에 해당 한다.

> 회원과 팀이 있다.
> 회원은 하나의 팀에만 속할 수 있다.

{% highlight java %}
---------           0..1  ----------
Member    --------------> Team
---------                 ----------
id                        id
Team team                 name
username
---------                 ----------
{% endhighlight %}

##### 객체 연관관계
Member 객체는 Member.team 필드로 팀객체와 연관 관계를 맺고 있고 이는 단방향 관계이다.
즉 Member는 team 필드로 팀을 알수 있지만 Team은 Member를 알아 낼 수 없다.

##### 테이블 연관관계
반면 테이블은 외래 키를 이용해서 양방향으로 조회 할 수 있다. 즉, 외래키를 이용해서 서로 JOIN해주면 양방향의 관계를 알아 낼 수 있다.


#### 객체 관계 매핑
{% highlight java %}
@Entity
public class Member {
  @Id
  @Column(name = "MEMBER_ID")
  private String id;

  private String username;

  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team;

  // Getter, Setter...
}

@Entity
public class Team {
  @Id
  @Column(name = "TEAM_ID")
  private String id;

  private String name;

  // Getter, Setter...
}
{% endhighlight %}

##### @ManyToOne
말그 대로 N:1의 관계를 라는 매핑 정보 이다.

###### 속성
  * **optional**
    * 기본은 true인데 false로 설정하면 연관된 Entity가 꼭 있어야 한다.
  * **fetch**
    * 8장에서...
    * FetchType.EAGER
    * FetchType.LAZY
  * **cascade**
    * 영속성 전이 기능을 사용
  * **targetEntity**
    * 연관된 엔티티의 타입 정보를 설정
    * {% highlight java %}
    @OneToMany
    private List<Member> members  // 제네릭으로 타입정보를 알수 있다.

    @OneToMany(targetEntity=Member.class)
    private List member // 제네릭이 없으면 타입 정보를 알수 없다.
    {% endhighlight %}



##### @JoinColumn(name="TEAM_ID")
JoinColumn 은 외래키를 매핑할 때 사용한다.

###### 속성
  * **name**
    * 매핑할 외래 키 이름
  * **referencedColumnName**
    * 외래 키가 참조하는 대상 테이블의 컬럼명
  * **foreignKey(DDL)**
    * 외래키 제약조건을 직접 설정하기위한 속성이다.
  * **unique**
  * **nullable**
  * **insertable**
  * **updatable**
  * **columnDefinition**
  * **table**
    * @Column속성과 같다.

### 연관관계 사용
#### 저장
JPA에서 엔티티를 저장할 때 연관된 모든 엔티티는 영속 상태여야 한다.
{% highlight java %}
Team team1 = new Team("team1", "팀1");
em.persist(team1);

Member member1 = new Member("member1", "회원1");
member1.setTeam(team1);
em.persist(member1);

Member member2 = new Member("member2", "회원2");
member2.setTeam(team1);
em.persist(member2);
{% endhighlight %}

#### 조회
연관관계가 있는 엔티티를 조회 하는 방법은 "객체 그래프 탐색" 방법과 "객체지향 쿼리 사용" 이 있다.

##### 객체 그래프 탐색
{% highlight java %}
Member member = em.find(Member.class, "member1");
Team team = member.getTeam();   // <---- 이것이 객체 그래프 탐색이다.
{% endhighlight %}

##### 객체지향 쿼리 사용
객체지향 쿼리인 JPQL을 이용한 방법이다.
{% highlight java %}
String jpql = "select m from Member m join m.team t where t.name = :teamName";

List<Member> resultList = em.createQuery(jpql, Member.class)
                          .setParmeter("teamName", "팀1")
                          .getResultList();
{% endhighlight %}

#### 수정
em.update()와 같은 함수는 없다. 단순히 아래와 같이 처리하면 된다.
{% highlight java %}
Team team2 = new Team("team2", "팀2");
em.persist(team2);

Member member = em.fine(Member.class, "member1");
member.setTeam(team2);
{% endhighlight %}

#### 연관 관계 제거
아래와 같이 null로 처리해 주면 관계는 삭제 된다.
{% highlight java %}
Member member = em.fine(Member.class, "member1");
member.setTeam(null);
{% endhighlight %}

#### 연관된 엔티티 삭제
연관된 엔티티를 삭제 하려면 해당 엔티티를 사용하는 모은 엔티티의 연관 관계를 제거 해줘야 한다.
{% highlight java %}
member1.setTeam(null);
member2.setTeam(null);
em.remove(team);
{% endhighlight %}


### 양방향 연관관계
단방향에서는 "회원" --> "팀" 으로만 확인이 가능했다면 양방향에서는 "팀" --> "회원" 으로도 확인이 가능해야 한다.
RDB의 Table에서의 관계는 양방향과 단방향이 모두 동일하다.(FK로 서로 교차 검색이 가능하다)

{% highlight java %}
@Entity
public class Team {
  @Id
  @Column(name = "TEAM_ID")
  private String id;

  private String name;

  // 추가
  @OneToMany(mappedBy = "team")
  private List<Member> members = new ArrayList<Member>();

  // Getter, Setter...
}
{% endhighlight %}

mappedBy는 양방향 매핑을 할때 반대쪽에 매핑할 필드의 이름이다.

### 연관관계의 주인
mappedBy는 왜? 필요할까??
  * 객체에서 양방향 관계라는 것은 없다. -> 2개의 단방향 관계가 있는 것이다.
  * mappedBy는 연관관계의 주인을 정해주는 작업이다.
  * 연관관계의 주인은 외래키가 존재하는 엔티티가 된다.
  * 즉, 연관관계 주인 만이 연관관계를 갱신할 수 있고, 반대편(inverse, non-owning side)는 읽기만 가능하다.

### 양방향 연관관계 저장 및 주의할 점
예제 에서는 Member.team 연관관계의 주인이므로 아래 코드의 내용에 주의 해줘야한다.
{% highlight java %}
// 정상적인 연관관계의 설정은 Member 에서 이루어져야 한다.
Team team1 = new Team("team1", "팀1");
em.persist(team1);

Member member2 = new Member("member2", "회원2");
member.setTeam(team1);
em.persist(member2);

// Team에서 연관관계를 업데이트 하려고 시도하는것은 무시된다.
Member member2 = new Member("member2", "회원2");
em.persist(member2);

Team team1 = new Team("team1", "팀1");
team1.getMembers().add(member2);
em.persist(team1);
{% endhighlight %}
하지만 순수 객체로 따져 보면 위 예제의 정상과 비정상 예제의 내용이 모두 실행되어야 정상적으로 동작하게 된다.
그래서 Member의 setTeam을 아래와 같이 수정해 주면 순수 객체에서도 정상동작 하게 된다.

{% highlight java %}
public void setTeam(Team team){
  // 기존팀 관계 제거
  //   -> 영속성 컨텍스트가 새로 시작되면 문제가 없지만 영속성 컨텍스트를 계속 사용중이라면
  //      문제가 발생 할 수 있다.
  if (this.team != null){
      this.team.getMembers().remove(this);
  }
  this.team = team;
  team.getMembers().add(this);
}
{% endhighlight %}




<!--more-->
