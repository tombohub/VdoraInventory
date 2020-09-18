function getJsonData(){
  
  /*>>> SETTING LOGIN CREDENTIALS <<<*/
  const formData = {
    "wk_email": "EMAIL HERE",
    "wk_password": "PASSWORD HERE",
    'redirect_url': '',
    'wk_login_submit': ''
    
  }
  
  const loginUrl = 'URL-HERE'
  
  
  /*==== SETTING REQUEST HEADER OPTIONS FOR FORM SUBMIT ====*/
  const loginOptions = {
    'method': 'post',
    'payload': formData,
    'followRedirects': false
    
  }
  
  
  /*======== LOGIN FORM SUBMIT, GETTING COOKIES AND PARSING TO MAKE THEM SUITABLE FOR COOKIE HEADER REQUEST IN NEXT URL=====*/
  const loginResponse = UrlFetchApp.fetch(loginUrl, loginOptions)
  const cookies = loginResponse.getAllHeaders()['Set-Cookie']
  let cookiesNameValuePairs = []
  cookies.forEach(cookie => {
                    let nameValuePair = cookie.split(';')[0];
                    cookiesNameValuePairs.push(nameValuePair)                    
                  });
  const cookieHeader = cookiesNameValuePairs.join(';')
  

    
  /*===== SETTING COOKIE REQUEST HEADER, PREVIUOSLY PARSED ========*/
  const ordersOptions = {
    'headers': {
      'Cookie': cookieHeader,
    }
  }
      
  
  /*=========== FINALLY REQUESTING LIST OF ORDERS IN JSON FORMAT =====*/
  const apiPoint = 'API POINT'
  const response = UrlFetchApp.fetch(shortUrl)
  
  function parse(response) {
    const data = response.getContentText()
 
    
    Logger.log(data)
  }
}

