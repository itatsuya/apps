public class BadCalculator {
   public static void main(String[] args) {
      try {
          new BadCalculator().divide();
      } catch (CustomException err) {
          System.out.println("main catch");
      }
   }
	
   void divide() throws CustomException {
      try {
          int i = 1 / 0;
      } catch (RuntimeException re) {
          System.out.println("catch");
          throw new CustomException();
      } finally {
          System.out.println("finally");
      }
   }
}

/////////////////////////////////////////
//    original
////////////////////////////////////////
//public class BadCalculator {
//   public static void main(String[] args) {
//      try {
//          new BadCalculator().divide();
//      } catch (Error err) {
//          System.out.println("main catch");
//      }
//   }
//	
//   void divide() throws Error {
//      try {
//          int i = 1 / 0;
//      } catch (RuntimeException re) {
//          System.out.println("catch");
//          throw new CustomException();
//      } finally {
//          System.out.println("finally");
//      }
//   }
//}