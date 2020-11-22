/* eslint-disable @typescript-eslint/no-explicit-any */
import MemberSerive from '@app/Services/ProjectMember';

export function verifyIsOwnerMember(userIdPos: number, projectIdPos: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      await MemberSerive.verifyIsOwnerMember(
        args[userIdPos],
        args[projectIdPos]
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function verifyIsProjectMember(userIdPos: number, projectIdPos: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      await MemberSerive.verifyIsProjectMember(
        args[userIdPos],
        args[projectIdPos]
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
