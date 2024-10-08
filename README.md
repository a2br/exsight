# ExSight

ExSight (_Exchange Insights_) is a Next.js web app made to help EPFL sophomores choose their exchanges.

Every time a student updates their preferences, the simulation is re-run, and every stat is updated (for now, the process takes a few seconds, generally under 5).

Please don't hesitate to submit PR's, any help would be greatly appreciated!

To host it on your machine, all you need is a Postgres database to upload the Prisma schemas to. The hosted version is on Vercel, and it uses its Storage feature.

## to-do

This is on the roadmap

- [ ] Fix CUHK IN bug (two agreements for one section. Unexpected behavior.)
  - Implies changing infrastructure: now looking up schools, not agreements.
    - How would, for instance, be the best IN assigned to either agreement?
  - Choice A: manually parse both agreements into a single agreement with a property that says "minimum students for IN is 1"
  - Choice B: (probably best) student picks a school. Every relevant agreement is picked out, and displayed in the walkthrough.
- [ ] Fix Inter ligatures outside Chrome for ->, or use icon
- [ ] Add more loading animations
  - The backend is sometimes very slow for some operations, and some feedback to the user would be very helpful
- [ ] Make what's clickable more friendly (hover effects, etc... fortunately this is a mobile first app)
- [ ] Make it usable on desktop (far future)
- [ ] Manually label & implement special cases (eg, Polytechnique de Montréal: max 3 places for GM)
- [ ] Have Google auth 100% 5xx-errorless
- [ ] Spectator mode

- [ ] Investigate possible performance improvements
- [ ] Move the hell away from Vercel edge functions & host prod on VPS
