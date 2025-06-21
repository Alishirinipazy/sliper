export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  
  try {
    const data = await $fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      body: body,
      headers: {
        'Accept': 'application/json',
      },
    });
    setCookie(event,"login_token",data.data.login_token,{
      httpOnly:true,
      secure:true,
      maxAge:60*60*24*7,
      path:'/'
    })
    return "success data"
   
  } catch (error) {
    return error;
  }
});
