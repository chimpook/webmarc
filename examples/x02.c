#include <ncurses.h>

int main()
{
    int ch;

    initscr();              // done
    raw();                  // no
    keypad(stdscr, TRUE);   // no
    noecho();               // no
    
    printw("Type any character to see it in bold\n");   // done
    ch = getch();           // no

    if(ch == KEY_F(1))
    {
        printw("F1 Key pressed");   // done
    }
    else
    {
        printw("The pressed key is ");
        attron(A_BOLD);     // todo
        printw("%c", ch);   // todo
        attroff(A_BOLD);    // todo
    }
    refresh();
    getch();
    endwin();

    return 0;
}
