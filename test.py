#Given a length 2 array with the base length and height ([base,height]) of a right triangular hill, 
#determine if the hill is safe for the penguin slide down.

def slide(arr):
  return arr[0]>=arr[1]

if __name__ == "__main__":
    input = sys.argv[1].split(',')
    input = [int(x) for x in input]
    result = sys.argv[2]
    print(result)
    print(slide(input))
    print(str(slide(input))==result)