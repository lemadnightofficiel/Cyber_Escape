import { AppState } from 'react-native';

interface CodeSnippet {
    code: string;
    errorLine: number;
    errorChar: string;
  }
  
  // Utility function to add line numbers to code
  const addLineNumbers = (code: string): string => {
    const lines = code.split('\n');
    const maxLineNumber = lines.length;
    const lineNumberPadding = String(maxLineNumber).length;
  
    const numberedCode = lines.map((line, index) => {
      const lineNumber = String(index + 1);
      let paddedLineNumber = lineNumber.padStart(lineNumberPadding, ' '); // Pad all numbers to the correct width
  
      // Add an extra space if it's a single-digit number
      if (lineNumber.length === 1) {
        paddedLineNumber = ' ' + paddedLineNumber;
      }
  
      return `${paddedLineNumber}: ${line}     `;
    }).join('\n');
  
    return numberedCode;
  };
  
  const javascriptCodeSnippets: CodeSnippet[] = [
    {
      code: addLineNumbers(
        `function calculateArea(width, height {\n` +
        `  let area = width * height;\n` +
        `  return area;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function greet(name) {\n` +
        `  console.log("Hello, " + name)\n` +
        `  return;\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function isEven(number) {\n` +
        `  return number % 2 === 0\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function reverseString(str) {\n` +
        `  return str.split("").reverse().join("")\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function multiply(a, b) {\n` +
        `  return a * b\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function add(a, b {\n` +
        `  return a + b;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function subtract(a, b) {\n` +
        `  return a - b\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function divide(a, b {\n` +
        `  return a / b;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function square(a {\n` +
        `  return a * a;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function isPositive(number {\n` +
        `  return number > 0;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function calculatePerimeter(width, height) {\n` +
        `  return 2 * (width + height)\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function toUpperCase(str) {\n` +
        `  return str.toUpperCase);\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: '(',
    },
    {
      code: addLineNumbers(
        `function toLowerCase(str) {\n` +
        `  return str.toLowerCase()\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function getFirstElement(arr {\n` +
        `  return arr[0];\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function getLastElement(arr) {\n` +
        `  return arr[arr.length - 1]\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function addToArray(arr, element {\n` +
        `  arr.push(element);\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `function removeFromArray(arr, element) {\n` +
        `  const index = arr.indexOf(element);\n` +
        `  if (index > -1) \n` +
        `    arr.splice(index, 1);\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `function sumArray(arr) {\n` +
        `  let sum = 0;\n` +
        `  for (let i = 0; i < arr.length; i++) {\n` +
        `    sum += arr[i];\n` +
        `  }\n` +
        `  return sum\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function multiplyArray(arr) {\n` +
        `  let product = 1\n` +
        `  for (let i = 0; i < arr.length; i++) {\n` +
        `    product *= arr[i];\n` +
        `  }\n` +
        `  return product;\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `function findMax(arr) {\n` +
        `  let max = arr[0];\n` +
        `  for (let i = 1; i < arr.length; i++) {\n` +
        `    if (arr[i] > max) {\n` +
        `      max = arr[i];\n` +
        `    }\n` +
        `  }\n` +
        `  return max\n` +
        `}\n`
      ),
      errorLine: 8,
      errorChar: ';',
    },
  ];
  
  const golangCodeSnippets: CodeSnippet[] = [
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func main() {\n` +
        `  fmt.Println("Hello, World!"\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func add(a int, b int int {\n` +
        `  return a + b\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func subtract(a int, b int) int {\n` +
        `  return a - b\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt\n` +
        `func multiply(a int, b int) int {\n` +
        `  return a * b\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: '"',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func divide a float64, b float64) float64 {\n` +
        `  return a / b\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: '(',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func modulus(a int, b int) int {\n` +
        `  return a % b\n` +
        `\n`
      ),
      errorLine: 5,
      errorChar: '}',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func power(base int, exponent int) int {\n` +
        `  result := 1\n` +
        `  for i = 0; i < exponent; i++ {\n` +
        `    result *= base\n` +
        `  }\n` +
        `  return result\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func factorial(n int) int {\n` +
        `  if n == 0 {\n` +
        `    return 1\n` +
        `  }\n` +
        `  return n * factorial(n-1)/\n` +
        `}\n`
      ),
      errorLine: 7,
      errorChar: '/',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func absoluteValue(n int int {\n` +
        `  if n < 0 {\n` +
        `    return -n\n` +
        `  }\n` +
        `  return n\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func isEven(n int) bool {\n` +
        `  return n%2 = 0\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: '=',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func isPositive(n int) bol {\n` +
        `  return n > 0\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: 'O',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func max(a int b int) int {\n` +
        `  if a > b {\n` +
        `    return a\n` +
        `  }\n` +
        `  return b\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ',',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func min(a int, b int) int \n` +
        `  if a < b {\n` +
        `    return a\n` +
        `  }\n` +
        `  return b\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func sum(numbers []int) int {\n` +
        `  total = 0\n` +
        `  for _, num := range numbers {\n` +
        `    total += num\n` +
        `  }\n` +
        `  return total\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func reverseString(s string) string {\n` +
        `  r := []rune(s)\n` +
        `  for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 \n` +
        `    r[i], r[j] = r[j], r[i]\n` +
        `  }\n` +
        `  return string(r)\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func countVowels(s string) int {\n` +
        `  count := 0\n` +
        `  for _, char := range s {\n` +
        `    switch char {\n` +
        `    case 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'\n` +
        `      count++\n` +
        `    }\n` +
        `  }\n` +
        `  return count\n` +
        `}\n`
      ),
      errorLine: 7,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func isPalindrome(s string) bool {\n` +
        `  for i := range s {\n` +
        `    if s[i] != s[len(s)-1-i] \n` +
        `      return false\n` +
        `    }\n` +
        `  }\n` +
        `  return true\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func average(numbers []float64) float64 {\n` +
        `  total = 0.0\n` +
        `  for _, num := range numbers {\n` +
        `    total += num\n` +
        `  }\n` +
        `  return total / float64(len(numbers))\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func findMax(numbers []int) int {\n` +
        `  if len(numbers) == 0 {\n` +
        `    return 0\n` +
        `  }\n` +
        `  max := numbers[0]\n` +
        `  for _, num = range numbers {\n` +
        `    if num > max {\n` +
        `      max = num\n` +
        `    }\n` +
        `  }\n` +
        `  return max\n` +
        `}\n`
      ),
      errorLine: 8,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `package main\n` +
        `import "fmt"\n` +
        `func findMin(numbers []int int {\n` +
        `  if len(numbers) == 0 {\n` +
        `    return 0\n` +
        `  }\n` +
        `  min := numbers[0]\n` +
        `  for _, num := range numbers {\n` +
        `    if num < min {\n` +
        `      min = num\n` +
        `    }\n` +
        `  }\n` +
        `  return min\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
  ];
  
  const phpCodeSnippets: CodeSnippet[] = [
    {
      code: addLineNumbers(
        `<?php\n` +
        `echo "Hello, World!"\n` +
        `?>\n`
      ),
      errorLine: 2,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function add(int $a, int $b): int {\n` +
        `  return $a + $b\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function subtract(int $a, int $b): int {\n` +
        `  return $a - $b\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function multiply(int $a, int $b): int {\n` +
        `  return $a * $b\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function divide(float $a, float $b) float {\n` +
        `  return $a / $b;\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 2,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function modulus(int $a, int $b): int {\n` +
        `  return $a % $b\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function power(int $base, int $exponent): int {\n` +
        `  return $base ** $exponent\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function factorial(int $n): int {\n` +
        `  if ($n == 0) {\n` +
        `    return 1;\n` +
        `  } else {\n` +
        `    return $n * factorial($n - 1);\n` +
        `  \n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 7,
      errorChar: '}',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function isEven(int $n): bool {\n` +
        `  return n % 2 === 0;\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: '$',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function isPositive(int $n): bool {\n` +
        `  return $n > 0\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function max(int $a, int $b): int {\n` +
        `  return ($a > $b) ? $a  $b;\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function min(int $a, int $b): int {\n` +
        `  return ($a < $b)  $a : $b;\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: '?',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function reverseString(string $str): string {\n` +
        `  return strrev(str);\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: '$',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function countVowels(string $str): int {\n` +
        `  return preg_match_all('/[aeiou]/i', $str)\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function isPalindrome(string $str): bool {\n` +
        `  $str = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $str);\n` +
        `  return $str === strrev($str);\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function sumArray(array $arr) int {\n` +
        `  return array_sum($arr);\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 2,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function multiplyArray(array $arr): int {\n` +
        `  $result = 1;\n` +
        `  foreach ($arr as $num) \n` +
        `    $result *= $num;\n` +
        `  }\n` +
        `  return $result;\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 4,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function findMax(array $arr): int {\n` +
        `  return max($arr)\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function findMin(array arr): int {\n` +
        `  return min($arr);\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 2,
      errorChar: '$',
    },
    {
      code: addLineNumbers(
        `<?php\n` +
        `function removeDuplicates(array $arr): array {\n` +
        `  return array_unique$arr);\n` +
        `}\n` +
        `?>\n`
      ),
      errorLine: 3,
      errorChar: '(',
    },
  ];
  
  const javaCodeSnippets: CodeSnippet[] = [
    {
      code: addLineNumbers(
        `public class Main {\n` +
        `  public static void main(String[] args) {\n` +
        `    System.out.println("Hello, World!";\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `public class Calculator {\n` +
        `  public int add(int a, int b) {\n` +
        `    return a + b\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `public class MathUtils {\n` +
        `  public int subtract(int a, int b) {\n` +
        `    return a - b\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `public class NumberCruncher {\n` +
        `  public int multiply(int a, int b) {\n` +
        `    return a * b\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `public class Divider {\n` +
        `  public double divide(double a, double b) {\n` +
        `    return a / b\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `public class Modulo {\n` +
        `  public int modulus(int a, int b) {\n` +
        `    return a % b\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `public class Power {\n` +
        `  public int power(int base int exponent) {\n` +
        `    int result = 1;\n` +
        `    for (int i = 0; i < exponent; i++) {\n` +
        `      result *= base;\n` +
        `    }\n` +
        `    return result;\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ',',
    },
    {
      code: addLineNumbers(
        `public class Factorial {\n` +
        `  public int factorial(int n) {\n` +
        `    if (n == 0) {\n` +
        `      return 1;\n` +
        `     else {\n` +
        `      return n * factorial(n - 1);\n` +
        `    }\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: '}',
    },
    {
      code: addLineNumbers(
        `public class AbsoluteValue {\n` +
        `  public int absoluteValue(int n) {\n` +
        `    if (n < 0 {\n` +
        `      return -n;\n` +
        `    }\n` +
        `    return n;\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `public class EvenChecker \n` +
        `  public boolean isEven(int n) {\n` +
        `    return n % 2 == 0;\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `public class PositiveChecker {\n` +
        `  public boolean isPositive(int n) \n` +
        `    return n > 0;\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `public class MaxFinder {\n` +
        `  public int max(int a int b) {\n` +
        `    return Math.max(a, b);\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 2,
      errorChar: ',',
    },
    {
      code: addLineNumbers(
        `public class MinFinder {\n` +
        `  public int min(int a, int b) {\n` +
        `    return Math.min(a, b)\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `import java.util.Arrays;\n` +
        `public class ArraySummer {\n` +
        `  public int sumArray(int[] arr) {\n` +
        `    return Arrays.stream(arr)sum();\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: '.',
    },
    {
      code: addLineNumbers(
        `public class StringReverser {\n` +
        `  public String reverseString(String str) {\n` +
        `    return new StringBuilder(str).reverse().toString);\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: '(',
    },
    {
      code: addLineNumbers(
        `public class VowelCounter {\n` +
        `  public int countVowels(String str) {\n` +
        `    return str.toLowerCase()replaceAll("[^aeiou]", "").length();\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: '.',
    },
    {
      code: addLineNumbers(
        `public class PalindromeChecker {\n` +
        `  public boolean isPalindrome(String str) {\n` +
        `    String cleanStr = str.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");\n` +
        `    return cleanStr.equals(new StringBuilder(cleanStr).reverse().toString();\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ')',
    },
    {
      code: addLineNumbers(
        `import java.util.Arrays;\n` +
        `public class ArrayMultiplier {\n` +
        `  public int multiplyArray(int[] arr) {\n` +
        `    return Arrays.stream(arr).reduce(1, (a, b) -> a * b)\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `import java.util.Arrays\n` +
        `public class MaxArrayFinder {\n` +
        `  public int findMax(int[] arr) {\n` +
        `    return Arrays.stream(arr).max().orElse(Integer.MIN_VALUE);\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `import java.util.Arrays;\n` +
        `public class MinArrayFinder {\n` +
        `  public int findMin(int[ arr) {\n` +
        `    return Arrays.stream(arr).min().orElse(Integer.MAX_VALUE);\n` +
        `  }\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ']',
    },
  ];
  
  const cplusplusCodeSnippets: CodeSnippet[] = [
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int main() {\n` +
        `  std::cout << "Hello, World!" << std::endl\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int add(int a, int b) {\n` +
        `  return a + b\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << add(5, 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int subtract(int a, int b) {\n` +
        `  return a - b\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << subtract(5, 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int multiply(int a, int b) {\n` +
        `  return a * b\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << multiply(5, 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `double divide(double a, double b) {\n` +
        `  return a / b;\n` +
        `}\n` +
        `int main() {\n` +
        `  std:cout << divide(5.0, 3.0) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `include <iostream>\n` +
        `int modulus(int a, int b) {\n` +
        `  return a % b;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << modulus(5, 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: '#',
    },
    {
      code: addLineNumbers(
        `#include <iostream\n` +
        `int power(int base, int exponent) {\n` +
        `  int result = 1;\n` +
        `  for (int i = 0; i < exponent; i++) {\n` +
        `    result *= base;\n` +
        `  }\n` +
        `  return result;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << power(2, 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 1,
      errorChar: '>',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int factorial(int n) {\n` +
        `  if (n == 0) {\n` +
        `    return 1;\n` +
        `  } else \n` +
        `    return n * factorial(n - 1);\n` +
        `  }\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << factorial(5) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int absoluteValue(int n) {\n` +
        `  if (n < 0) {\n` +
        `    return -n\n` +
        `  }\n` +
        `  return n;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << absoluteValue(-5) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `bool isEven(int n) {\n` +
        `  return n % 2 == 0;\n` +
        `}\n` +
        `int main() \n` +
        `  std::cout << std::boolalpha << isEven(4) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: '{',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `bool isPositive(int n) {\n` +
        `  return n > 0;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout < std::boolalpha << isPositive(5) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: '<',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int max(int a, int b) {\n` +
        `  return (a > b) ? a : b;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << max(5 3) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: ',',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int min(int a, int b) {\n` +
        `  return (a < b) ? a : b;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << min(5, 3) << std:endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: ':',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `#include <string>\n` +
        `std::string reverseString(std::string str) {\n` +
        `  std::string reversed = "";\n` +
        `  for (int i = str.length() - 1; i >= 0 i--) {\n` +
        `    reversed += str[i];\n` +
        `  }\n` +
        `  return reversed;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << reverseString("hello") << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `#include <string>\n` +
        `int countVowels(std::string str) {\n` +
        `  int count = 0;\n` +
        `  for (char c : str) {\n` +
        `    c = tolower(c)\n` +
        `    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {\n` +
        `      count++;\n` +
        `    }\n` +
        `  }\n` +
        `  return count;\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << countVowels("hello") << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 6,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `#include <string>\n` +
        `bool isPalindrome(std::string str) {\n` +
        `  std::string reversed = "";\n` +
        `  for (int i = str.length() - 1; i >= 0; i--) {\n` +
        `    reversed += str[i];\n` +
        `  }\n` +
        `  return (str = reversed);\n` +
        `}\n` +
        `int main() {\n` +
        `  std::cout << std::boolalpha << isPalindrome("madam") << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 8,
      errorChar: '=',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int sumArray(int arr[], int size) {\n` +
        `  int sum = 0\n` +
        `  for (int i = 0; i < size; i++) {\n` +
        `    sum += arr[i];\n` +
        `  }\n` +
        `  return sum;\n` +
        `}\n` +
        `int main() {\n` +
        `  int numbers[] = {1, 2, 3, 4, 5};\n` +
        `  int size = sizeof(numbers) / sizeof(numbers[0]);\n` +
        `  std::cout << sumArray(numbers, size) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 3,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int multiplyArray(int arr[], int size) {\n` +
        `  int product = 1;\n` +
        `  for (int i = 0; i < size; i+) {\n` +
        `    product *= arr[i];\n` +
        `  }\n` +
        `  return product;\n` +
        `}\n` +
        `int main() {\n` +
        `  int numbers[] = {1, 2, 3, 4, 5};\n` +
        `  int size = sizeof(numbers) / sizeof(numbers[0]);\n` +
        `  std::cout << multiplyArray(numbers, size) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: '+',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int findMax(int arr[], int size) {\n` +
        `  int max = arr[0];\n` +
        `  for (int i = 1; i < size i++) {\n` +
        `    if (arr[i] > max) {\n` +
        `      max = arr[i];\n` +
        `    }\n` +
        `  }\n` +
        `  return max;\n` +
        `}\n` +
        `int main() {\n` +
        `  int numbers[] = {5, 2, 8, 1, 9};\n` +
        `  int size = sizeof(numbers) / sizeof(numbers[0]);\n` +
        `  std::cout << findMax(numbers, size) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 4,
      errorChar: ';',
    },
    {
      code: addLineNumbers(
        `#include <iostream>\n` +
        `int findMin(int arr[], int size) {\n` +
        `  int min = arr[0];\n` +
        `  for (int i = 1; i < size; i++) {\n` +
        `    if (arr[i] < min {\n` +
        `      min = arr[i];\n` +
        `    }\n` +
        `  }\n` +
        `  return min;\n` +
        `}\n` +
        `int main() {\n` +
        `  int numbers[] = {5, 2, 8, 1, 9};\n` +
        `  int size = sizeof(numbers) / sizeof(numbers[0]);\n` +
        `  std::cout << findMin(numbers, size) << std::endl;\n` +
        `  return 0;\n` +
        `}\n`
      ),
      errorLine: 5,
      errorChar: ')',
    },
];

const getCodeSnippet = (language: string, usedQuestions: string[]): CodeSnippet => {
  let snippetArray: CodeSnippet[];

  switch (language) {
      case 'javascript':
          snippetArray = javascriptCodeSnippets;
          break;
      case 'golang':
          snippetArray = golangCodeSnippets;
          break;
      case 'php':
          snippetArray = phpCodeSnippets;
          break;
      case 'java':
          snippetArray = javaCodeSnippets;
          break;
      case 'c++':
          snippetArray = cplusplusCodeSnippets;
          break;
      default:
          throw new Error(`Unsupported language: ${language}`);
  }

  // Filter out used questions
  const availableSnippets = snippetArray.filter(snippet => !usedQuestions.includes(snippet.code));

  // If all questions have been used, reset the usedQuestions array (optional, but prevents infinite loops)
  if (availableSnippets.length === 0) {
      return {
          code: "No questions available",
          errorLine: 0,
          errorChar: ""
      }
  }

  // Select a random snippet
  const randomIndex = Math.floor(Math.random() * availableSnippets.length);
  return availableSnippets[randomIndex];
};

export {
  javascriptCodeSnippets,
  golangCodeSnippets,
  phpCodeSnippets,
  javaCodeSnippets,
  cplusplusCodeSnippets,
  getCodeSnippet,
  CodeSnippet
};