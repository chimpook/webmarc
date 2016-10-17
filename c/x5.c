#include <ncurses.h>
#include <stdlib.h>

int main(int argc, char * argv[])
{
    int ch, prev, row, col;
    prev = EOF;
    FILE *fp;
    int y, x;

    if (argc != 2)
    {
        printf("Usage: %s <a c file name>\n", argv[0]);
        exit(1);
    }

    fp = fopen(argv[1], "r");
    if (fp == NULL)
    {
        perror("Cannot open input file");
        exit(1);
    }

    initscr();                              /* Start curses mode */
    getmaxyx(stdscr, row, col);             /* find the boundaries of the screen */

    while ((ch = fgetc(fp)) != EOF)
    {
        getyx(stdscr, y, x);                /* get the current cursor position */
        if (y == (row - 1))
        {
            printw("<-Press Any Key->");
            getch();
            clear();
            move(0, 0);
        }

        if (prev == '/' && ch == '*')
        {
            attron(A_BOLD);
            getyx(stdscr, y, x);
            move(y, x - 1);
            printw("%c%c", '/', ch);
        }
        else
        {
            printw("%c", ch);
        }
        refresh();

        if (prev == '*' && ch == '/')
        {
            attroff(A_BOLD);
        }
        prev = ch;
    }
    getch();
    endwin();
    fclose(fp);
    return 0;
}
