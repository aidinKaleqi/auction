export class Utility {
  public static formatResponse<T>(
    body: T,
    requestId: string
  ): {
    data: T;
    meta: {
      requestId: string;
      time: number;
    };
  } {
    return {
      data: body,
      meta: {
        requestId,
        time: Date.now(),
      },
    };
  }

  public static getTimestampString(): string {
    return Date.now().toString();
  }

  public static getCurrentTime(): number {
    return Date.now();
  }
}