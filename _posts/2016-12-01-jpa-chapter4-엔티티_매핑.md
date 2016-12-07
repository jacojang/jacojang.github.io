---
layout: post
title: JPA - 4장 - 엔티티 매핑
categories: [jpa, java, hibernate]
comments: true
image:
---
> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

매핑 애노테이션 을 크게 4가지로 분류하면

  * **객체와 테이블 매핑** : @Entity, @Table
  * **기본 키 매핑** : @Id
  * **필드와 컬럼 매핑** : @column
  * **연관관계 매핑** : @ManyToOne, @JoinColumn

### @Entity
클래스에 @Entity 를 붙여주면 JPA가 Entity로서 관리 한다는 것을 의미한다.

##### 속성
  * **name**
    * 다른 Entity와 충돌이 우려될 경우 이름을 바꿔준다. 기본적으로는 Class명을 따른다.

##### 주의사항
  * 기본 생성자 필수
  * final, enum, interface, inner 클래스 사용 못함
  * 저장 필드에 final 사용 못함


### @Table
Entity와 매핑할 DB Table을 지정 한다.

##### 속성
  * **name**
    * 매핑할 table 이름, 기본은 Entity 이름을 사용한다.
  * **catalog**
    * catalog 기능이 있는 DB에서 catalog를 매핑
  * **schema**
    * schema 기능이 있는 DB에서 schema를 매핑
  * **uniqueConstraints**
    * DDL 생성 시에 유니크 제약조건을 만든다.

### 데이터베이스 스키마 자동 생성
자동으로 스키마를 생성하는 기능은 아래 값을 설정 함으로써 가능하다.
{% highlight xml %}
<property name="hibernate.hbm2ddl.auto" value="create"/>
{% endhighlight %}

##### value
  * **create**
    * 기존 Table Drop + 생성
  * **create-drop**
    * create후 종료시 drop까지 실행
  * **update**
    * 변경된 내용만 수정한다. 이건 JPA스팩에는 없고 hibernate에만 있는 설정 이다.
  * **validate**
    * 기존 DB Table정보와 비교해서 차이가 있다면 경고하고 애플리케이션을 실행 하지 않는다. 이건 JPA스팩에는 없고 hibernate에만 있는 설정 이다.
  * **none**
    * 설정이 없거나 유효하지 않은 값을 설정하면 기능을 사용하지 않게된다.

### 기본 키 매핑
primary key를 설정하는 것을 말한다.

##### 직접할당
  em.persist()를 호출하기전에 사용자가 직접 ID를 설정하는 것을 말한다.
  {% highlight java %}
  Board board = new Board();
  board.setId("board1");
  em.persist(board);
  {% endhighlight %}

##### 자동생성
  * **IDENTITY**
    * 기본키의 생성을 DB에 위임하는것을 말한다. MySQL의 AUTO_INCREMENT와 같은것을 말한다.
    * @GeneratedValue(strategy = GenerationType.IDENTITY) 로 설정 가능
  * **SEQUENCE**
    * 유일한 값을 순서대로 생성하는 특별한 데이터베이스 오브젝트를 이용하는 방법을 말한다.
    * @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOARD_SEQ_GENERATOR") 로 설정 가능
    {% highlight java %}
    @Entity
    @SequenceGenerator(
      name = "BOARD_SEQ_GENERATOR",
      sequenceName = "BOARD_SEQ", // 실제 DB의 Sequence Name
      initialValue = 1, allocationSize = 1 )
    public class Board {
    ...
      @Id
      @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOARD_SEQ_GENERATOR")
      private Long id;
    ...  
    }
    {% endhighlight %}
  * **TABEL**
    * 키 생성 전용 Table을 만들어서 이를 SEQUENCE 처럼 사용하는 것을 말한다.
    {% highlight java %}
    @Entity
    @TableGenerator(
      name = "BOARD_SEQ_GENERATOR",
      table = "MY_SEQUENCE", // 실제 DB의 Table name
      pkColumnValue = "BOARD_SEQ", allocationSize = 1 )
    public class Board {
    ...
      @Id
      @GeneratedValue(strategy = GenerationType.TABLE, generator = "BOARD_SEQ_GENERATOR")
      private Long id;
    ...  
    }
    {% endhighlight %}
  * **AUTO**
    * DB종류에 따라 JPA가 알맞은 것을 선태 하는것을 의미한다. Oracle의 경우 SEQUENCE, MySQL의 경우 IDENTITY를 선택하게 된다.
    * 또하나의 장점은 DB종류가 바뀌어도 소스를 수정하지 않아도 된다는 것이다.
    * @GeneratedValue(strategy = GenerationType.AUTO) 로 설정 가능

### 필드와 컬럼 매핑 : 레퍼런스
필드와 컬럼 매핑에 사용되는 어노테이션으로는 **@Column**, **@Enumerated**, **@Temporal**, **@Lob**, **@Transient**, **@Access** 가 있다.

#### @Column
객체 필드를 테이블 컬럼과 매핑해주는 가장 대표적인 어노테이션이다. name, nullable이 가장 많이 사용되고 나머지는 많이 사용되지는 않는다.

##### 속성
  * **name**
    * 매핑할 table 컬럼 이름, 기본은 객체의 필드 이름을 사용한다.
  * **insertable**
    * 거의 사용안됨, 엔티티 저장시 이 필드도 저장하라는 의미로 기본은 true이다 단 false로 하면 Readonly일때 사용가능 하다.
  * **updatable**
    * 거의 사용안됨, 엔티티 수정시 이 필드도 수정하라는 의미로 기본은 true이다 단 false로 하면 Readonly일때 사용가능 하다.
  * **table**
    * 거의 사용안됨, 하나의 엔티티를 두 개 이상의 테이블에 매핑할때 사용
  * **nullable**
    * false로 설정하면 DDL생성시에 "NOT NULL" 제약조건을 추가해 준다.
  * **unique**
    * @Table 의 uniqueConstraints와 같지만 한컬럼에 대해서 적용할때는 간단하게 이걸 이용가능, 단 여러 컬럼을 사용할때는 @Table의 uniqueConstraints를 사용해야 한다.
  * **columnDefinition**
    * 사용자가 직접 컬럼의 정보를 입력해준다.
  * **length**
    * 문자 길이에 대한 제약조건을 준다. String 타입에만 적용되며 기본값은 255이다.
  * **precision, scale**
    * BigDecimal 타입에서 사용된다. precision은 소수점을 포함한 전체 지릿수, scale은 소수 자리수를 의미. float, double에는 해당 되지 않는다.

#### @Enumerated
enum 타입을 매핑할 때 사용한다.

##### 속성
  * **name**
    * EnumType.ORDINAL
      * enum의 순서를 DB에 저장, 이값이 Default이다.
      * 숫자로 저장되므로 데이터크기가 작아지고 빠르다. enum의 순서를 변경할 수 없는 단점이 있다.
    * EnumType.STRING
      * enum이름을 DB에 저장
      * 문자로 저장되므로 데이터크기가 커지고 느리다. 하지만 enum의 순서와 상관없이 사용가능해 진다.
      * Default는 ORDINAL이지만 STRING을 더 추천 한다.

#### @Temporal
날짜 타입을 매핑할 때 사용
속성을 입력 하지 않으면 자바의 Date과 가장 유사한 Timestamp로 저장 된다(H2, Oracle, PostgreSQL). 하지만 이는 DB의 종류에 따라 Datetime으로 저장되기도 한다(MySQL).

##### 속성
  * **value**
    * TemporalType.DATE
      * 2013-01-23 와 같은 날짜 타입
    * TemporalType.TIME
      * 11:23:18 과 같은 시간 타입
    * TemporalType.TIMESTAMP
      * 2013-01-23 11:23:18 과 같이 DB의 Timestamp 타입과 매핑


#### @Lob
@Lob는 별도의 속성은 없다. 대신 매핑을 문자열이면 CLOB, 그외의 타입에는 BLOB으로 매핑한다.

  * CLOB : String, char[], java.sql.CLOB
  * BLOB : byte[], java.sql.BLOB

#### @Transient
이 필드는 매핑하지 말라는 의미이다. 이는 임시로 중간 값을 저장하는 용도로 사용가능하다.

#### @Access
JPA가 엔티티 데이터에 접근하는 방식, @Access를 설정하지 않으면 @Id의 설정위치에 따라 서 접근 방식이 결정 된다.
@Id가 필드에 붙어 있으면 FIELD접근 방식을 의미하므로 Getter가 없어도 된다. 아이디가 프로퍼티에 있으면 PROPERTY접근 방식을 의미하게 된다.
하지만 이 두가지 방식을 섞어서 사용도 가능하다.

  * AccessType.FIELD : 필드 접근, Private이어도 접근 가능하다.
  * AccessType.PROPERTY : 프로퍼티 접근, 접근자(Getter)를 이용한다.

<!--more-->
