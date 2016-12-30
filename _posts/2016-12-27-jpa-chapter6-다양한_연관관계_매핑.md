---
layout: post
title: JPA - 6장 - 다양한 연관관계 매핑
categories: [jpa, java, hibernate]
comments: true
image:
---
> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

### 다대일

#### 다대일 단방향 [N:1]
{% highlight java %}
---------  *           1  ----------
Member    --------------> Team
---------                 ----------
id                        id
Team team                 name
username
---------                 ----------
{% endhighlight %}

Member에서는 @MenyToOne 으로 Team을 참조 할 수 있도록 해주고 Team에서는 별도의 설정을 하지 않는다.

##### Member
{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team;
}
{% endhighlight %}

##### Team
{% highlight java %}
@Entity
public class Team {
  @Id @GeneratedValue
  @Column(name = "TEAM_ID")
  private Long id;

  private String name;
}
{% endhighlight %}


#### 다대일 양방향 [N:1, 1:N]
{% highlight java %}
---------           team  ----------
Member    --------------> Team
---------  members     1  ----------
id        <-------------- id
Team team  *              List members
username                  name
---------                 ----------
{% endhighlight %}

Member에서는 @MenyToOne 으로 Team을 참조 할 수 있도록 해주고
Team에서는 @OneToMany 와 함께 mappedBy값을 설정 해서 연관관계의 주인이 Member테이블임을 알려준다.

항상 1:N, N:1 관계에서는 항상 N쪽에 외래키가 있다. 여기에서는 N쪽인 Member 테이블이 외래키를 가지게 된다. 그러므로 Member.team이 연관관계의 주인이 된다.

##### Member
{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team;

  public void setTeam(Team team){
    this.team = team;

    if(!team.getMembers().contains(this)){
      team.getMembers.().add(this);
    }
  }
}
{% endhighlight %}

##### Team
{% highlight java %}
@Entity
public class Team {
  @Id @GeneratedValue
  @Column(name = "TEAM_ID")
  private Long id;

  @OneToMany(meppedBy = "team")
  private List<Member> members

  private String name;

  public void addMember(Member member){
    this.members.add(member);
    if(member.getTeam() != this){
      member.setTeam(this);
    }
  }
}
{% endhighlight %}


### 일대다

#### 일대다 단방향 [N:1]
{% highlight java %}
---------  1           *  ----------
Team      --------------> Member
---------        members  ----------
id                        id
name                      username
List members
---------                 ----------
{% endhighlight %}

보통은 자신이 매핑한 테이블의 외래키를 가지는데 반해 여기서는 Member 테이블에 외래키가 있다.
일대다 관계에서는 꼭 JoinColumn을 선언 해줘야 한다. 안그러면 조인 테이블을 중간에 두는 방식으로 설정 된다.

일대다의 단점은 매핑한 객체가 관리하는 외래 키가 다른 테이블에 있으므로 Insert SQL한번으로 조작이 끝나는것이 아닌 연관 테이블의 Update도 해줘야하는 문제가 있다.

그러므로, 일대다 보다는 다대일 단방향 매핑을 사용하자~~~!!!

##### Team
{% highlight java %}
@Entity
public class Team {
  @Id @GeneratedValue
  @Column(name = "TEAM_ID")
  private Long id;

  @OneToMany
  @JoinColumn(name = "TEAM_ID") // Member 테이블의 TEAM_ID 를 나타냄
  private List<Member> members;

  private String name;
}
{% endhighlight %}

##### Member
{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;
}
{% endhighlight %}


#### 일대다 단방향 [N:1]
일대다 양방향 매핑은 존재 하지 않는다. 대시 다대일 매핑을 사용해야 한다. 다시 말해 양방향 매핑에서는 @OneToMany는 연관관계의 주인이 될 수 없다는 것이다.



### 일대일
양쪽이 서로 하나의 관계만을 가진다. 즉, 일대일 관계는 그 반대도 일대일 관계다.

#### 주 테이블에 외래 키
JPA에서는 주 테이블에 외래 키가 있는것이 좀더 편리하게 매핑할 수 있게된다.

##### 단방향
Member 와 Locker의 관계로 알아보자. 아래 모습은 다대일(N:1)단방향 모습과 매우 흡사하다.

{% highlight java %}
------------   1           1  ----------
Member        --------------> Locker
------------                  ----------
id                            id
Locker locker                 name
username                  
------------                  ----------
{% endhighlight %}

{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @OneToOne
  @JoinColumn(name = "LOCKER_ID")
  private Locker locker;
}

@Entity
public class Locker {
  @Id @GeneratedValue
  @Column(name = "LOCKER_ID")
  private Long id;

  private String name;
}
{% endhighlight %}


##### 양방향
양방향의 주인이 정해 졌다. Member 테이블의 왜래키를 가지고 있으며 Member.locker가 연관관계의 주인이다.
Locker는 mappedBy를 이용해서 연관관계의 주인을 선언한다.

{% highlight java %}
------------           locker ----------
Member        --------------> Locker
------------               1  ----------
id             1              id
Locker locker <- - - - - - -- name
username       member         Member member
------------                  ----------
{% endhighlight %}

{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @OneToOne
  @JoinColumn(name = "LOCKER_ID")
  private Locker locker;
}

@Entity
public class Locker {
  @Id @GeneratedValue
  @Column(name = "LOCKER_ID")
  private Long id;

  private String name;

  @OneToOne(mappedBy = "locker")
  private Member member;
}
{% endhighlight %}

#### 대상 테이블에 외래 키
JPA에서는 주 테이블에 외래 키가 있는것이 좀더 편리하게 매핑할 수 있게된다.

##### 단방향
이는 JPA에서 지원 하지 않는다.

##### 양방향
대상테이블인 Locker에서 외래키를 관리하는 모습이다.
{% highlight java %}
------------           locker ----------
Member        - - - - - - - > Locker
------------               1  ----------
id             1              id
Locker locker <-------------- name
username       member         Member member
------------                  ----------
{% endhighlight %}

{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @OneToOne(mappedBy = "member")
  private Locker locker;
}

@Entity
public class Locker {
  @Id @GeneratedValue
  @Column(name = "LOCKER_ID")
  private Long id;

  private String name;

  @OneToOne
  @JoinColumn(name = "MEMBER_ID")
  private Member member;
}
{% endhighlight %}


### 다대다
다대다는 한쪽에 외래키를 두고 2개의 테이블로 관계를 표현 할 수가 없어서 중간에 연결테이블을 추가 하게 된다.

하지만 객체의 관계는 2개의 객체로 표현이 가능하다.

다대다 관계인 "Member"와 "Product"로 살펴보자.

#### 단방향
Member에서 Product를 @ManyToMany로 연결한다. 중요한 점은 @JoinTable을 이용해서 연결 테이블을 설정해 주는 것이다.
MEMBER_PRODUCT 테이블은 다대다 관계를 "일대다, 다대일" 관계로 풀어내기 위한 연결 테이블이다.
{% highlight java %}
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;

  private String username;

  @ManyToMany
  @JoinTable(name = MEMBER_PRODUCT,
            joinColumns = @JoinColumn(name = "MEMBER_ID"),
            inverseJoinColumns = @JoinColumn(name = "PRODUCT_ID")
  private List<Product> products = new ArrayList<Product>();
}

@Entity
public class Product {
  @Id @GeneratedValue
  @Column(name = "PRODUCT_ID")
  private Long id;

  private String name;
}
{% endhighlight %}

사용 예제
{% highlight java %}
public void save(){
  Product productA = new Product();
  productA.setId("ProductA");
  productA.setName("상품A");
  em.persist(productA);

  Member member1 = new Member();
  member1.setId("member1");
  member1.setUsername("회원1");
  member1.getProducts().add(ProductA); // 연관관계 설정
  em.persist(member1);
}

public void find(){
  Member member = em.find(Member.class, "member1");
  List<Product> products = member.getProducts();
  for(Product product : products){
    System.out.println("product.name = " + product.getName());
  }
}
{% endhighlight %}

#### 단방향
단방향과 마찬가지로 양방향은 반대쪽도 @ManyToMany를 사용한다.
그리고 양방향중 한곳에 mappedBy를 설정해서 연관관계 주인을 지정해 준다. mappedBy가 없는 쪽이 연관관계의 주인이다.

{% highlight java %}
@Entity
public class Product {
    @Id
    private String id;

    @ManyToMany(mappedBy = "products")
    private List<Member> members;

    ...
}
{% endhighlight %}


<!--more-->
