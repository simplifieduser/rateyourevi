
import { readFile } from "fs/promises"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

const dataString = await readFile("./prisma/seed.json")
const data = JSON.parse(dataString)

data.maleStudents.forEach(async (student) => {

  await client.maleStudent.create({
    data: {
      fullName: student.fullName,
      firstName: student.firstName,
      lastName: student.lastName,
      totalVotes: 0,
    }
  })

})

data.femaleStudents.forEach(async (student) => {

  await client.femaleStudent.create({
    data: {
      fullName: student.fullName,
      firstName: student.firstName,
      lastName: student.lastName,
      totalVotes: 0,
    }
  })

})



