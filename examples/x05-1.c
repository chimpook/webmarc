#include <ncurses.h>
#include <stdlib.h>

void testAttr(char *name, int value);

int main()
{
    initscr();

    testAttr("A_NORMAL", A_NORMAL);
    testAttr("A_STANDOUT", A_STANDOUT);
    testAttr("A_UNDERLINE", A_UNDERLINE);
    testAttr("A_REVERSE", A_REVERSE);
    testAttr("A_BLINK", A_BLINK);
    testAttr("A_DIM", A_DIM);
    testAttr("A_BOLD", A_BOLD);
    testAttr("A_PROTECT", A_PROTECT);
    testAttr("A_INVIS", A_INVIS);
    testAttr("A_ALTCHARSET", A_ALTCHARSET);
    testAttr("A_CHARTEXT", A_CHARTEXT);

    testAttr("XXX", A_BOLD + A_UNDERLINE);

    getch();
    endwin();
    return 0;
}

void testAttr(char *name, int value)
{
    
    printw("%s: \t[ ", name);
    attron(value);
    printw("ATTR String test", name, value);
    attroff(value);
    printw("]\t:%x\n", value);
}
