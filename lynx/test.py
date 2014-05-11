
''' The prime factors of 13195 are 5, 7, 13 and 29.

What is the largest prime factor of the number 600851475143 ? '''



def tpf(n):
	x = 1
	sar = []
	while x * x < n:
		while n % x == 0:
			n = n / x
			sar.append(n)
		x+=1
	print(max(sar))

tpf(600851475143)