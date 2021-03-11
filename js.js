var i;
var fib = [];

fib[0] = BigInt(0);
fib[1] = BigInt(1);
for (i = 2; ; i++) {
  fib[i] = fib[i - 2] + fib[i - 1];
  if(String(fib[i]).length==1000){
  	console.log(i)
  	return;
  }
}