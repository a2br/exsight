# ExSight

ExSight (_Exchange Insights_) is a Next.js web app made to help EPFL sophomores choose their exchanges.

Every time a student updates their preferences, the simulation is re-run, and every stat is updated (for now, the process takes a few seconds, generally under 5).

Please don't hesitate to submit PR's, any help would be greatly appreciated!

To host it on your machine, all you need is a Postgres database to upload the Prisma schemas to. The hosted version is on Vercel, and it uses its Storage feature.

## to-do

This is on the roadmap

- [ ] Fix Inter ligatures outside Chrome for ->, or use icon
- [ ] Add more loading animations
  - The backend is sometimes very slow for some operations, and some feedback to the user would be very helpful
- [ ] Make what's clickable more friendly (hover effects, etc... fortunately this is a mobile first app)
- [ ] Make it usable on desktop (far future)
- [ ] Investigate possible performance improvements
