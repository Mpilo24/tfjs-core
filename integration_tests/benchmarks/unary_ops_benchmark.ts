/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs-core';

import {BenchmarkTest} from './benchmark';
import * as benchmark_util from './benchmark_util';

function getUnaryOp(option: string) {
  switch (option) {
    case 'log':
      return (x: tf.Tensor) => x.log();
    case 'exp':
      return (x: tf.Tensor) => x.exp();
    case 'expm1':
      return (x: tf.Tensor) => x.expm1();
    case 'neg':
      return (x: tf.Tensor) => x.neg();
    case 'ceil':
      return (x: tf.Tensor) => x.ceil();
    case 'floor':
      return (x: tf.Tensor) => x.floor();
    case 'log1p':
      return (x: tf.Tensor) => x.log1p();
    case 'sqrt':
      return (x: tf.Tensor) => x.sqrt();
    case 'rsqrt':
      return (x: tf.Tensor) => x.rsqrt();
    case 'square':
      return (x: tf.Tensor) => x.square();
    case 'abs':
      return (x: tf.Tensor) => x.abs();
    case 'relu':
      return (x: tf.Tensor) => x.relu();
    case 'elu':
      return (x: tf.Tensor) => x.elu();
    case 'selu':
      return (x: tf.Tensor) => x.selu();
    case 'leakyRelu':
      return (x: tf.Tensor) => x.leakyRelu();
    case 'prelu':
      // TODO: Configurable from UI
      const alpha = tf.scalar(0.1);
      return (x: tf.Tensor) => x.prelu(alpha);
    case 'sigmoid':
      return (x: tf.Tensor) => x.sigmoid();
    case 'logSigmoid':
      return (x: tf.Tensor) => x.logSigmoid();
    case 'sin':
      return (x: tf.Tensor) => x.sin();
    case 'cos':
      return (x: tf.Tensor) => x.cos();
    case 'tan':
      return (x: tf.Tensor) => x.tan();
    case 'asin':
      return (x: tf.Tensor) => x.asin();
    case 'acos':
      return (x: tf.Tensor) => x.acos();
    case 'atan':
      return (x: tf.Tensor) => x.atan();
    case 'sinh':
      return (x: tf.Tensor) => x.sinh();
    case 'cosh':
      return (x: tf.Tensor) => x.cosh();
    case 'tanh':
      return (x: tf.Tensor) => x.tanh();
    case 'asinh':
      return (x: tf.Tensor) => x.asinh();
    case 'acosh':
      return (x: tf.Tensor) => x.acosh();
    case 'atanh':
      return (x: tf.Tensor) => x.atanh();
    case 'step':
      return (x: tf.Tensor) => x.step();
    case 'sign':
      return (x: tf.Tensor) => x.sign();
    case 'round':
      return (x: tf.Tensor) => x.round();
    case 'reciprocal':
      return (x: tf.Tensor) => x.reciprocal();
    case 'softplus':
      return (x: tf.Tensor) => x.softplus();
    case 'erf':
      return (x: tf.Tensor) => x.erf();
    default:
      throw new Error(`Not found such ops: ${option}`);
  }
}

export class UnaryOpsCPUBenchmark implements BenchmarkTest {
  async run(size: number, option: string): Promise<number> {
    tf.setBackend('cpu');

    const input: tf.Tensor2D = tf.randomUniform([size, size], -1, 1);
    const op = getUnaryOp(option);
    const start = performance.now();

    tf.tidy(() => {
      op(input).dataSync();
    });

    const end = performance.now();
    return end - start;
  }
}

export class UnaryOpsGPUBenchmark implements BenchmarkTest {
  async run(size: number, option: string) {
    tf.setBackend('webgl');

    const input: tf.Tensor2D = tf.randomUniform([size, size], -1, 1);
    const op = getUnaryOp(option);

    const benchmark = () => op(input);

    const time = await benchmark_util.warmupAndBenchmarkGPU(benchmark);

    input.dispose();
    return time;
  }
}
