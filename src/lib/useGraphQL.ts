import { generateClient } from 'aws-amplify/api';
import { useCallback } from 'react';

type AnyVariables = Record<string, any> | undefined;

type AuthMode = 'userPool' | 'apiKey' | 'iam' | 'oidc' | 'lambda';

export type GraphQLOptions<TVariables extends AnyVariables> = {
  variables?: TVariables;
  authOrder?: AuthMode[];
};

const clients: Record<string, any> = {};

export function useGraphQL() {
  function getClient(authMode: AuthMode): any {
    if (!clients[authMode]) {
      clients[authMode] = generateClient({ authMode });
    }
    return clients[authMode];
  }

  const execute = useCallback(async function <
    TOutput,
    TVariables extends AnyVariables = AnyVariables,
  >(query: string, options?: GraphQLOptions<TVariables>): Promise<TOutput> {
    // Default to a single auth mode to avoid double calls; allow explicit fallback when requested
    const authOrder: AuthMode[] = options?.authOrder ?? ['userPool'];

    let lastError: any;
    for (const mode of authOrder) {
      try {
        const client = getClient(mode);
        const response = await client.graphql({
          query,
          variables: options?.variables,
        });

        const anyResponse = response as unknown as {
          data?: any;
          errors?: Array<{ message: string }>;
        };
        if (anyResponse.errors && anyResponse.errors.length > 0) {
          throw new Error(anyResponse.errors.map(e => e.message).join('; '));
        }
        return (anyResponse.data ?? response) as TOutput;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  }, []);

  return { execute };
}
