/* eslint-disable @typescript-eslint/no-explicit-any */
import BadRequestError from '@app/Error/BadRequestError';
import mongoose from '@config/database';

export default function validId(paramsName: string, paramsPos: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      const id = args[paramsPos];

      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequestError(`Invalid ${paramsName} Id`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
