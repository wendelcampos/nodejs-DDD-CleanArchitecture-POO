import { AggregateRoot } from "@/core/entities/aggregate-root";
import { DomainEvent } from "./domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }

    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id;
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create () {
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent( new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}

describe("DomainEvent", () => {
    it("should be able to dispatch and listen to events", () => {
        const callbackSpy = vi.fn();

        // Subscribe cadastrado (ouvindo o evento de "resposta criada")
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

        // Estou criando uma resposta porem SEM salvar no banco
        const aggregate = CustomAggregate.create();

        // Estou assegurando que o evento foi criado NÃO foi disparado  
        expect(aggregate.domainEvents).toHaveLength(1);

        // Estou salvando a resposta no banco de dados e assim disparando o evento
        DomainEvents.dispatchEventsForAggregate(aggregate.id);

        // O subscribe ouve o evento e faz o que precisa ser feito com o dado
        expect(callbackSpy).toHaveBeenCalled();
        expect(aggregate.domainEvents).toHaveLength(0);
    });
});