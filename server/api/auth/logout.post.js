export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event,'token')
    const {
      public: { apiBase },
    } = useRuntimeConfig();
    
    
    try {
      const data = await $fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
      });
   
      setCookie(event,"token","",{
        httpOnly:true,
        secure:true,
        maxAge:new Date(0),
        path:'/'
      })
      return data
     
    } catch (error) {
        console.log(error);
        return error;
    }
  });
  