import tracer from 'dd-trace';

if (process.env.NODE_ENV === 'production') {
  tracer.init({
    analytics: true,
  });

  tracer.use('express', {
    analytics: true,
  });
}

export default process.env.NODE_ENV === 'production' && tracer;
