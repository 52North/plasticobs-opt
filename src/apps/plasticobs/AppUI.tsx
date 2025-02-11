// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, ForceAuth, useAuthState } from "@open-pioneer/authentication";
import { Container, Heading, Text, chakra } from "@open-pioneer/chakra-integration";
import { useIntl, useService } from "open-pioneer:react-hooks";
import { Notifier } from "@open-pioneer/notifier";

export function AppUI() {
    const intl = useIntl();

    return (
        <>
            <Notifier position="bottom-right" />
            <ForceAuth>
                <Container>
                    <Heading as="h1" size="lg">
                        {intl.formatMessage({ id: "heading" })}
                    </Heading>
                    <Text pt={5}>{intl.formatMessage({ id: "text" })}</Text>
                    <Text pt={5}>Authenticated!</Text>
                </Container>
            </ForceAuth>
        </>
    );
}
