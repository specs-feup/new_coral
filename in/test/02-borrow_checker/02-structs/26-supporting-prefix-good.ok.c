typedef struct A {
  int a;
} A;

typedef struct B {
  A b;
} B;

#pragma coral lf %a
typedef struct C {
  #pragma coral lf c = %a
  const B * c;
} C;

#pragma coral lf %a
typedef struct D {
  #pragma coral lf d.%a = %a
  C d;
} D;

int main() {
  B b;
  b.b.a = 5;
  D d;
  d.d.c = &b;

  int *restrict ref1 = &d.d.c->b.a;

  B b2;
  b2.b.a = 5;
  D d2;
  d2.d.c = &b2;

  d.d;

  ref1;
}

