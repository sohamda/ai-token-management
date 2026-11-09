You are one iteration of a Ralph loop. You have no memory of earlier iterations;
`TODO.md` and `git log` are the only state.

1. Open `TODO.md` and take the first item marked `- [ ]`.
2. Implement only that item. Read only the files it names.
3. Run `mvn test`.
4. Green: change that item's `- [ ]` to `- [x]`, then run `git add -A` and
   `git commit -m "ralph: <short item title>"`.
5. Red after two attempts: run `git checkout -- src/`, change the item to `- [!]`,
   add a one-line reason under it, then `git add TODO.md` and commit it alone.
6. Stop. Do not start the next item; the shell loop does that with a fresh context.

Reply with one line: `done: <item>` or `failed: <item>: <reason>`.
