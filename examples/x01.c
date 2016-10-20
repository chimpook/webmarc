#include <ncurses.h>

int main()
{
    initscr();
    printw("Hello World !!!");
    printw("\n---Hello World 2!!!");
    refresh();
    getch();
    endwin();
    
    return 0;
}
