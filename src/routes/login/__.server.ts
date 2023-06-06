
export const actions = {

  default: async ({ request, cookies, url })/*: ServerResponse<LoginAction>*/ => {


      const data = await request.formData()
      const code = data.get("c")

      const redirect = url.searchParams.get("r") || "/"

      if (!code) return { success: false, error: { reason: "missing", field: "code" } }

      try {
          const user = await prisma.user.findUnique({ where: { accessCode: code.toString() } })
          if (!user) return { success: false, error: { reason: "unauthorized", details: "Invalid Access Code" } }

          const hash = crypto.createHash("sha256")
          const token = hash.update(code.toString()).digest("hex")

          cookies.set("token", token, { maxAge: 3600 })

          return {
              success: true,
              data: { redirect: redirect, userName: user.name }
          }

      } catch (error) {
          return { success: false, error: { reason: "internalError" } }
      }

  }

}