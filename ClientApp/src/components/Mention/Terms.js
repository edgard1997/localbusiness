import React, { Component, useState } from 'react';
import { Container } from 'reactstrap';
import './Mention.css';
import { Link } from 'react-router-dom';


export default function Terms() {

    return (<div className='mention-content'>
        <div className='mention-banner'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h3 className='text-center title-1'>RÈGLEMENT</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>1.Préambule.</h3>
                    <p className='mention-text' >
                        Bienvenue et merci de votre intérêt pour Yaillo. Veuillez lire attentivement les conditions d'utilisation suivantes, toutes les règles et directives requises pour l'utilisation du Service. En utilisant le Service, vous acceptez de vous conformer à ces Conditions qui créent un contrat juridique entre vous et Yaillo. Si vous n'êtes pas en accord avec une partie ou la totalité de ces Conditions, vous devez immédiatement cesser d'utiliser le Service.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>2.Acceptation des conditions.</h3>
                    <p className='mention-text'>
                        En accédant au Service, vous acceptez de vous conformer pleinement à toutes les règles et directives répertoriées sur cette page. Vous acceptez le fait d'être banni ou attaqué légalement en cas de violation de ces conditions. Vous devez être en conformité avec la totalité de ces conditions pour utiliser le Service, pas partiellement. sinon, nous vous recommandons fortement de ne pas utiliser le Service. Notez que vous pouvez utiliser les termes suivants comme preuve contre le Service en cas de mauvaise conduite du Service ( ou de ses membres ) car ces termes représentent un contrat juridique entre vous et le Service.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2' >3.Conditions d'utilisation</h3>
                    <p className='mention-text'>
                       L'utilisation du Service comprend certaines directives à respecter. les principales sont les suivantes:
                    </p>

                    <p className='mention-text' >
                       N'utilisez pas le Service de manière inappropriée. Par exemple, n'essayez pas d'interférer avec ou d'accéder à notre Service en utilisant une méthode autre que l'interface et les instructions que nous vous fournissons. Vous ne devez utiliser notre Service qu'en conformité avec ces conditions d'utilisation. Nous pouvons suspendre ou interrompre la fourniture du Service si vous ne respectez pas les conditions ou réglementations applicables, ou si nous enquêtons sur un soupçon d'utilisation abusive.
                    </p>
                    <p className='mention-text' >
                      Pour vous inscrire, vous devez fournir certaines informations telles que le nom de votre business, votre adresse e-mail, votre emplacement (coordonnées gps ), votre pays ainsi que d'autres données personnelles (nom(s) et prénom(s) numéro de téléphone, etc...). En tant qu'utilisateur enregistré dans le Service, vous êtes responsable de toutes les activités qui se produisent sous vos identifiants d'accès, car vous pourrez les partager aux employés de votre business. Vous devez fournir votre nom, numéro de téléphone et adresse e-mail, ainsi que d'autres informations qui pourraient être nécessaires. En fournissant votre numéro de téléphone, vous acceptez de recevoir des reçus de facturation, des alertes, des mises à jour et d'autres informations par WhatsApp. Vous acceptez que le Service puisse accéder et fermer votre compte à tout moment pour toute raison légitime.
                    </p>
                    <p className='mention-text' >
                       L'utilisation du Service interdit fortement les actions qui violent les lois, règles ou règlements fédéraux, étatiques ou locaux, ou les droits de tout tiers. La modification, la création d'œuvres dérivées, la traduction, l'ingénierie inverse, la décompilation, le désassemblage, le piratage, l'endommagement ou toute autre interférence avec les fonctionnalités de sécurité du Service sont également fortement interdites. Le téléchargement de fichiers inappropriés, profanes, vulgaires, diffamatoires, contrefaisants, obscènes, indécents, illégaux, offensants ou immoraux tels que des images, du texte, de l'audio ou des vidéos est interdit et pourrait déclencher une poursuite contre vous.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id='privacy'>
                    <h3 className='text-center title-2'>4.Vie privée</h3>
                    <p className='mention-text' >
                        Les données que vous soumettez via le Service sont utilisées soit pour la personalisation de votre interface de navigation, soit pour répondre avec pertinence à vos questions et demandes. La création d'un compte nécessite quelques informations telles que le nom de votre business, votre adresse, votre numéro de téléphone, votre adresse e-mail, etc .... Beaucoup de ces informations sont utilisées pour vous identifier des autres comptes. D'autres informations telles que l'adresse e-mail, le numéro de téléphone ou l'adresse postale sont partagées avec vos clients. Toutes les données soumises au Service ( Mots de passe exclus ), pour des raisons de maintenance du Service, peuvent être commercialisées, partagées à des sites web affiliés ou à d'autres tiers.
                    </p>
                    <p className='mention-text' >
                        En addition, le Service utilise des scripts Google Analytics pour mieux comprendre le comportement de ses visiteurs pour une bien meilleure amélioration à l'avenir. Les données collectées par Google Analytics ne sont utilisées qu'à des fins de statistiques et de performances. Aucune donnée soumise via le Service n'est collectée par Google Analytics. Obtenez plus d'informations sur la collecte de données Google Analytics <a href="https://support.google.com/analytics/answer/6318039?hl=en">ici</a>
                    </p>
                    <p className='mention-text' id='cookies' >
                       Nous utilisons des cookies pour collecter des informations. Les «cookies» sont de petites informations qu'un site web envoie au disque dur de votre ordinateur lorsque vous consultez un site Web. Nous pouvons utiliser à la fois des cookies de session (qui expirent une fois que vous fermez votre navigateur Web) et des cookies persistants (qui restent sur votre ordinateur jusqu'à ce que vous les supprimiez) pour vous offrir une expérience unique via le Service. Veuillez noter qu'un cookie ne peut pas propager de virus informatiques, récupérer d'autres données à partir de votre disque dur ou capturer votre adresse e-mail.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>5.Limitation de responsabilité.</h3>
                    <p className='mention-text' >
                      Yaillo et ses fournisseurs déclinent, toutes sortes d'accusations, de propriété, de responsabilité concernant: toute donnée personnelle accidentellement supprimée ou perdue; tout dommage direct ou indirect, perte de profits ou interruption d'activité d'un utilisateur; toute utilisation illégale du Service dans l'État ou le pays du business; toute image, vidéo, fichier audio ou texte téléchargé par l'utilisateur.
                    </p>
                    <p className='mention-text' >
                        Dans la mesure permise par la loi, la responsabilité totale de Yaillo, ses fournisseurs, pour toute réclamation en vertu des présentes Conditions d'utilisation, y compris toute garantie implicite, est limitée au montant que vous nous avez payé pour utiliser le Service (ou, si cela est notre choix, pour que le Service vous soit à nouveau accessible).
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id='copyright'>
                    <h3 className='text-center title-2'>6.Droits de propriété.</h3>
                    <p className='mention-text' >
                          Les propriétaires de Yaillo détiennent le droit absolu de disposer du service à leur guise. Les interfaces visuelles (à l'exception des images et des icônes sur le site Web), la conception, la compilation, les informations, le code informatique et tous les autres éléments du service sont protégés par le droit d'auteur américain, international, les brevets, les marques de commerce et tous les autres droits de propriété intellectuelle et droits de propriété pertinents. et les lois applicables. Vous déclarez et garantissez que vous possédez tous les droits sur le contenu de votre compte. De plus, le Service a le droit, pour certaines raisons, de modifier ou de supprimer tout Contenu de compte à sa seule discrétion.
                        </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>7.À propos de ces conditions d'utilisation.</h3>
                    <p className='mention-text' >
                       Nous pouvons modifier ces conditions d'utilisation ou toute autre condition d'utilisation supplémentaire qui s'applique à Yaillo, par exemple, pour refléter les modifications de la loi ou du service. Nous vous recommandons de consulter régulièrement les conditions d'utilisation. Les modifications de ces conditions d'utilisation seront publiées sur cette page. Les modifications ne s'appliqueront pas rétroactivement et entreront en vigueur au moins quatorze (14) jours après leur publication. Cependant, les modifications concernant les nouvelles fonctionnalités ajoutées au Service ou les modifications apportées pour des raisons légales s'appliqueront immédiatement. Si vous n'acceptez pas les modifications apportées aux présentes conditions d'utilisation, vous devez supprimer votre compte et cesser d'utiliser le service.
                    </p>
                    <p className='mention-text' >
                      En cas de conflit entre les présentes conditions d'utilisation et les conditions d'utilisation supplémentaires, ces dernières prévalent. Ces conditions d'utilisation régissent votre relation avec Yaillo. Elles ne créent pas de droits pour les tiers bénéficiaires.
                    </p>
                    <p className='mention-text' >
                        Si vous ne respectez pas ces conditions d'utilisation et que nous ne prenons aucune mesure immédiate à ce sujet, cela ne signifie pas que nous renonçons à nos droits (par exemple, intenter une action en justice plus tard). S'il s'avère qu'une condition particulière n'est pas applicable, cela n'affectera pas les autres termes des présentes conditions d'utilisation.
                    </p>
                    <p className='mention-text' >
                     Toute personne, de tout type ou sexe violant les présentes conditions d'utilisation sera passible de poursuites devant les tribunaux compétents du lieu de résidence du violateur. Les frais de poursuites et ainsi que les honoraires de nos avocats étant également attribuées à ce dernier.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <br />
                    <br />
                    <p className='mention-text' >
                     Lundi, 09/11/2020.
                    </p>
                </div>
            </div>
        </div>
    </div>);

}