import nodeResolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
   input: 'src/index.js',
   output: {
      file: 'public/index.js',
      format: 'iife'
   },
   plugins: [
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      }),
      nodeResolve({
         extensions: ['.js', '.jsx']
      }),
      commonjs(),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx']
      }),
      cleanup({
         comments: 'none'
      })
     
    
   ]
}