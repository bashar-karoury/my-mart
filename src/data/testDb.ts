// import prisma from "./prismaClient";
import { addUser, getUser } from "./db";
enum Role {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}
(async () => {
  const user = {
    email: "tester10@testing.test",
    name: "tester10",
    password: "xxxx",
    address: "Bahri",
    // role: Role.CUSTOMER,
  };
  const createdUser = await addUser(user);
  console.log(createdUser);
  const foundUser = await getUser({ email: "tester@testing.test" });
  console.log(foundUser);
})();
