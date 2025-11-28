/* CNACK LEXICAL ANALYZER - Web Version */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ========== TOKEN DEFINITIONS ========== */

/* Token Types */
enum TokenType
{
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_OPERATOR,
    TOKEN_SEPARATOR,
    TOKEN_STRING,
    TOKEN_COMMENT,
    TOKEN_ERROR,
    TOKEN_EOF
};

/* Token Structure */
typedef struct
{
    enum TokenType type;      /* Kind of token it is*/
    const char *lexeme_start; /* Start of lexeme in source */
    int lexeme_length;        /* Length of the lexeme */
    int line;                 /* Line of the code the lexeme is found */
} Token;

/* ========== GLOBAL VARIABLES ========== */

/* Scanner state */
typedef struct
{
    const char *source_start; /* Start of entire source code */
    const char *token_start;  /* Start of current token being scanned */
    const char *scan_ptr;     /* Current scanning position */
    int line_number;          /* Current line number */
} Scanner;

Scanner scanner;

/* Keywords and Reserved words list */
char *keywords[] = {
    "int", "float", "char", "bool", "string",
    "const", "if", "else", "elif", "switch",
    "case", "default", "assign", "for", "while",
    "do", "break", "continue", "ask", "display",
    "execute", "exit", "true", "false", "fetch",
    "fn", "when", "otherwise"};
int keywordCount = 28;

/* ========== CHARACTER UTILITY FUNCTIONS ========== */

int isLetter(char c)
{
    return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
}

int isDigit(char c)
{
    return c >= '0' && c <= '9';
}

int isOperator(char c)
{
    switch (c)
    {
    case '+':
    case '-':
    case '*':
    case '/':
    case '%':
    case '=':
    case '<':
    case '>':
    case '!':
    case '&':
    case '|':
    case '^':
    case '~':
        return 1;
    default:
        return 0;
    }
}

int isSeparator(char c)
{
    switch (c)
    {
    case ',':
    case ';':
    case ':':
    case '(':
    case ')':
    case '{':
    case '}':
    case '[':
    case ']':
        return 1;
    default:
        return 0;
    }
}

int isWhitespace(char c)
{
    switch (c)
    {
    case ' ':
    case '\t':
    case '\n':
    case '\r':
        return 1;
    default:
        return 0;
    }
}

/* ========== SCANNER HELPER FUNCTIONS ========== */

/* Check if we've reached the end of source */
int reachedEnd()
{
    return *scanner.scan_ptr == '\0';
}

/* Get current character and move forward */
char consumeChar()
{
    scanner.scan_ptr++;
    return scanner.scan_ptr[-1];
}

/* Look at current character without consuming */
char currentChar()
{
    return *scanner.scan_ptr;
}

/* Look at next character without consuming */
char nextChar()
{
    if (reachedEnd())
        return '\0';
    return scanner.scan_ptr[1];
}

/* Check if next char matches, consume if true */
int matchNext(char expected)
{
    if (reachedEnd())
        return 0;
    if (*scanner.scan_ptr != expected)
        return 0;
    scanner.scan_ptr++;
    return 1;
}

/* ========== TOKEN CREATION FUNCTIONS ========== */

/* Create a token with current lexeme */
Token createToken(enum TokenType type)
{
    Token tok;
    tok.type = type;
    tok.lexeme_start = scanner.token_start;
    tok.lexeme_length = (int)(scanner.scan_ptr - scanner.token_start);
    tok.line = scanner.line_number;
    return tok;
}

/* Create an error token with message */
Token createErrorToken(const char *message)
{
    Token tok;
    tok.type = TOKEN_ERROR;
    tok.lexeme_start = message;
    tok.lexeme_length = (int)strlen(message);
    tok.line = scanner.line_number;
    return tok;
}

/* ========== TOKEN UTILITY FUNCTIONS ========== */

int isKeyword(const char *str, int length)
{
    for (int i = 0; i < keywordCount; i++)
    {
        if (strlen(keywords[i]) == length &&
            memcmp(str, keywords[i], length) == 0)
        {
            return 1;
        }
    }
    return 0;
}

void printToken(Token t)
{
    char *tokenTypeName;

    switch (t.type)
    {
    case TOKEN_KEYWORD:
        tokenTypeName = "KEYWORD";
        break;
    case TOKEN_IDENTIFIER:
        tokenTypeName = "IDENTIFIER";
        break;
    case TOKEN_NUMBER:
        tokenTypeName = "NUMBER";
        break;
    case TOKEN_OPERATOR:
        tokenTypeName = "OPERATOR";
        break;
    case TOKEN_SEPARATOR:
        tokenTypeName = "SEPARATOR";
        break;
    case TOKEN_STRING:
        tokenTypeName = "STRING";
        break;
    case TOKEN_COMMENT:
        tokenTypeName = "COMMENT";
        break;
    case TOKEN_ERROR:
        tokenTypeName = "ERROR";
        break;
    case TOKEN_EOF:
        tokenTypeName = "EOF";
        break;
    default:
        tokenTypeName = "UNKNOWN";
        break;
    }

    /* Print in table format using pointer and length */
    printf("%-6d | %-12s | %.*s\n", t.line, tokenTypeName,
           t.lexeme_length, t.lexeme_start);
}

void initScanner(const char *source)
{
    scanner.source_start = source;
    scanner.token_start = source;
    scanner.scan_ptr = source;
    scanner.line_number = 1;
}

void resetScanner()
{
    scanner.line_number = 1;
}

/* ========== LEXICAL ANALYZER ========== */

/* Skip all whitespace and track line numbers */
void skipWhitespaceAndNewlines()
{
    while (!reachedEnd())
    {
        char c = currentChar();
        if (c == ' ' || c == '\t' || c == '\r')
        {
            consumeChar();
        }
        else if (c == '\n')
        {
            scanner.line_number++;
            consumeChar();
        }
        else
        {
            break;
        }
    }
}

/* Scan identifier or keyword */
Token scanIdentifier()
{
    while (isLetter(currentChar()) || isDigit(currentChar()) || currentChar() == '_')
    {
        consumeChar();
    }

    /* Check if it's a keyword */
    int len = (int)(scanner.scan_ptr - scanner.token_start);
    if (isKeyword(scanner.token_start, len))
    {
        return createToken(TOKEN_KEYWORD);
    }
    return createToken(TOKEN_IDENTIFIER);
}

/* Scan number (integer or decimal) */
Token scanNumber()
{
    while (isDigit(currentChar()))
    {
        consumeChar();
    }

    /* Check for decimal point */
    if (currentChar() == '.' && isDigit(nextChar()))
    {
        consumeChar(); /* consume the dot */
        while (isDigit(currentChar()))
        {
            consumeChar();
        }
    }

    return createToken(TOKEN_NUMBER);
}

/* Scan string literal */
Token scanString(char quote)
{
    while (currentChar() != quote && !reachedEnd())
    {
        if (currentChar() == '\n')
            scanner.line_number++;
        consumeChar();
    }

    if (reachedEnd())
    {
        return createErrorToken("Unterminated string");
    }

    consumeChar(); /* closing quote */
    return createToken(TOKEN_STRING);
}

/* Scan single-line comment */
Token scanSingleLineComment()
{
    while (currentChar() != '\n' && !reachedEnd())
    {
        consumeChar();
    }
    return createToken(TOKEN_COMMENT);
}

/* Scan multi-line comment */
Token scanMultiLineComment()
{
    while (!reachedEnd())
    {
        if (currentChar() == '*' && nextChar() == '/')
        {
            consumeChar(); /* consume * */
            consumeChar(); /* consume / */
            return createToken(TOKEN_COMMENT);
        }
        if (currentChar() == '\n')
        {
            scanner.line_number++;
        }
        consumeChar();
    }
    return createErrorToken("Unterminated comment");
}

/* Main token scanner */
Token getNextToken()
{
    /* Skip whitespace */
    skipWhitespaceAndNewlines();

    /* Mark start of new token */
    scanner.token_start = scanner.scan_ptr;

    /* Check for EOF */
    if (reachedEnd())
    {
        return createToken(TOKEN_EOF);
    }

    /* Get current character */
    char c = consumeChar();

    /* Check for letters - identifiers or keywords */
    if (isLetter(c) || c == '_')
    {
        return scanIdentifier();
    }

    /* Check for digits - numbers */
    if (isDigit(c))
    {
        return scanNumber();
    }

    /* Check for operators using nested switch */
    switch (c)
    {
    case '+':
        if (matchNext('+'))
            return createToken(TOKEN_OPERATOR);
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '-':
        if (matchNext('-'))
            return createToken(TOKEN_OPERATOR);
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '*':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        if (matchNext('|'))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '/':
        if (matchNext('='))
        {
            return createToken(TOKEN_OPERATOR);
        }
        else if (matchNext('/'))
        {
            return scanSingleLineComment();
        }
        else if (matchNext('*'))
        {
            return scanMultiLineComment();
        }
        return createToken(TOKEN_OPERATOR);

    case '%':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '=':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '<':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '>':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '!':
        if (matchNext('='))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '&':
        if (matchNext('&'))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '|':
        if (matchNext('|'))
            return createToken(TOKEN_OPERATOR);
        return createToken(TOKEN_OPERATOR);

    case '^':
    case '~':
        return createToken(TOKEN_OPERATOR);

    /* Check for separators */
    case ',':
    case ';':
    case ':':
    case '(':
    case ')':
    case '{':
    case '}':
    case '[':
    case ']':
        return createToken(TOKEN_SEPARATOR);

    /* Check for strings */
    case '"':
        return scanString('"');

    case '\'':
        return scanString('\'');

    /* Unknown character */
    default:
        return createErrorToken("Unexpected character");
    }
}

/* Analyze code from string */
void analyzeCode(const char *code)
{
    Token token;

    /* Initialize scanner */
    initScanner(code);

    printf(">>> LEXICAL ANALYSIS RESULTS:\n");
    printf("--------------------------------------------------\n");

    /* Print table header */
    printf("LINE   | TOKEN TYPE   | LEXEME\n");
    printf("-------|--------------|---------------------------\n");

    /* Process all tokens */
    do
    {
        token = getNextToken();
        if (token.type != TOKEN_EOF)
        {
            printToken(token);
        }
    } while (token.type != TOKEN_EOF);
}

/* ========== MAIN PROGRAM ========== */

int main()
{
    char *input = NULL;
    size_t buffer_size = 0;
    size_t total_size = 0;
    size_t chunk_size = 1024;

    /* Allocate initial buffer */
    input = (char *)malloc(chunk_size);
    if (input == NULL)
    {
        fprintf(stderr, "Error: Memory allocation failed\n");
        return 1;
    }

    /* Read all input from stdin */
    size_t bytes_read;
    while ((bytes_read = fread(input + total_size, 1, chunk_size, stdin)) > 0)
    {
        total_size += bytes_read;

        /* If buffer is full, expand it */
        if (total_size + chunk_size > buffer_size + chunk_size)
        {
            buffer_size = total_size + chunk_size;
            char *new_input = (char *)realloc(input, buffer_size);
            if (new_input == NULL)
            {
                fprintf(stderr, "Error: Memory reallocation failed\n");
                free(input);
                return 1;
            }
            input = new_input;
        }
    }

    /* Null-terminate the string */
    input[total_size] = '\0';

    /* Check if we got any input */
    if (total_size == 0)
    {
        printf("Error: No input provided\n");
        free(input);
        return 1;
    }

    /* Analyze the input code */
    analyzeCode(input);

    /* Clean up */
    free(input);

    return 0;
}