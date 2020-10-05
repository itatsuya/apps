public class Calculator {
 public static void main(String[] args) {
  int i = 0;
  Calculator c = new Calculator();
  System.out.print(i++ + c.operation(i));
  System.out.println(i);
 }
	
 public int operation(int i) {
  System.out.print(i++);
  return i;
 }
	
}