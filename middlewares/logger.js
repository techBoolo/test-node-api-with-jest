export default (req, res, next) => {
  const reqTime = new Date().toLocaleString(
    undefined, 
    {
      dateStyle: 'medium', timeStyle: 'medium'
    }
  )
  console.log(req.method, req.url, reqTime);
  next()
}
