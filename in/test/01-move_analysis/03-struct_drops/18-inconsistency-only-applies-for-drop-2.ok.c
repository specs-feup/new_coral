#pragma coral move
struct B
{
  int b;
};

void d(struct A *a);


struct A {
  struct B a;
  struct B b;
};

int test(struct A a) {
  if (1) {
    a.a;
  }

  return 0;
}