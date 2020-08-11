## Usage

```
- name: Custom Action to comment
  uses: ./.github/actions/comment-on-pr
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # option, but one needed
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }} # option, but one needed
    comment: 'Hello World!'
```

## Dev

```
cd ./github/actions/comment-on-pr

npm install
npm run build

# ... commit & push
```

:warning: **ALWAYS** run `npm run build` before pushing or else changes will not be picked up. :warning:

The action runs the built version of the codebase, not `index.ts`!!

## Resources

- https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

## Ideas

- update pull request body description, can have a section at the bottom separated via comments

- `with` option to force action to create a new comment instead of updating existing one
  - which one will be updated later? last or first?
